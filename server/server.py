'''Baseline code taken from https://wiki.python.org/moin/BaseHttpServer'''

from http.server import HTTPServer, BaseHTTPRequestHandler
from io import BytesIO
import time
import json

HOST_NAME = ""
PORT_NUMBER = 8080

URL_hash_table = dict()
address_book = dict()

class HTTPRequestHandler(BaseHTTPRequestHandler):
        def do_HEAD(self):
            print(self)
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()

        def do_GET(self):
            print(self)
            '''Respond to a GET request'''
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            '''Send over content'''
            (client_host, client_port) = self.client_address
            client_host = address_book[client_host]
            URL = URL_hash_table.get(client_host, "")
            self.send_header("Content-Length", str(len(URL)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            '''Remove the client_host-URL key-value pair from the hash table'''
            if (URL != ""): 
                URL_hash_table.pop(client_host)
            print(URL, type(URL))
            URL = URL.encode("utf8")
            print(URL, type(URL))
            self.wfile.write(URL)
            print(self.headers)
            print("AB", address_book)
            print("UHT", URL_hash_table)

        def do_POST(self):
            '''Respond to a PUT request'''
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            jsonBody = body.decode('utf8').replace("'", '"')
            jsonBody = json.loads(jsonBody)
            jsonBody = eval(jsonBody)
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            response = BytesIO()
            response.write(b'This is POST request. ')
            response.write(b'Received: ')
            response.write(body)
            self.wfile.write("POST request for {}".format(self.path).encode('utf-8')) 
            #self.wfile.write(response.getvalue())
            '''Add the shared tab in the dictionary'''
            if (jsonBody["type"] == "share"):
                target_host = jsonBody["recipientName"]
                URL = jsonBody["url"]
                URL_hash_table[target_host] = URL
            elif (jsonBody["type"] == "register"):
                name = jsonBody["name"]
                (client_host, client_port) = self.client_address
                address_book[client_host] = name
            print(self.headers)
            print("AB", address_book)
            print("UHT", URL_hash_table)


if __name__ == '__main__':
    httpd = HTTPServer((HOST_NAME, PORT_NUMBER), HTTPRequestHandler)
    print(time.asctime(), "Server Startes = %s:%s" % (HOST_NAME, PORT_NUMBER))
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print(time.asctime(), "Server Stops - %s:%s" % (HOST_NAME, PORT_NUMBER))
