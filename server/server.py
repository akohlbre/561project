'''Baseline code taken from https://wiki.python.org/moin/BaseHttpServer'''

from http.server import HTTPServer, BaseHTTPRequestHandler
from io import BytesIO
import time

HOST_NAME = ""
PORT_NUMBER = 8080

URL_hash_table = dict()

class HTTPRequestHandler(BaseHTTPRequestHandler):
        def do_HEAD(self):
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()

        def do_GET(self):
            '''Respond to a GET request'''
            self.send_response(200)
            # self.send_header("Content-type", "text/html")
            self.end_headers()
            '''Send over content'''
            (client_host, client_port) = self.client_address
            URL = URL_hash_table.get(client_host, "")
            self.wfile.write(URL)
            '''Remove the client_host-URL key-value pair from the hash table'''
            if (URL != ""): 
                URL_hash_table.pop(client_host)

        def do_POST(self):
            '''Respond to a PUT request'''
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            self.send_response(200)
            self.end_headers()
            response = BytesIO()
            response.write(b'This is POST request. ')
            response.write(b'Received: ')
            response.write(body)
            self.wfile.write(response.getvalue())
            '''Add the shared tab in the dictionary'''
            target_host = body.split(":")[0]
            URL = body.split(":")[1]
            URL_hash_table[target_host] = URL


if __name__ == '__main__':
    httpd = HTTPServer((HOST_NAME, PORT_NUMBER), HTTPRequestHandler)
    print(time.asctime(), "Server Startes = %s:%s" % (HOST_NAME, PORT_NUMBER))
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print(time.asctime(), "Server Stops - %s:%s" % (HOST_NAME, PORT_NUMBER))
