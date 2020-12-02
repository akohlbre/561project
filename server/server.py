'''Baseline code taken from https://wiki.python.org/moin/BaseHttpServer'''

from http.server import HTTPServer, BaseHTTPRequestHandler
from io import BytesIO
import time
import json
from urllib.parse import urlparse

HOST_NAME = ""
PORT_NUMBER = 8080

'''Maps receiverName --> (url, senderName)'''
URL_hash_table = dict()
'''Maps address --> name'''
address_book = dict()
'''Set of all the Names in the neighborhood'''
all_names = set()

'''Convert a Python byte string to a json object'''
def json_unpack(bs):
    jsonBody = bs.decode('utf8').replace("'", '"')
    jsonBody = json.loads(jsonBody)
    jsonBody = eval(jsonBody)
    return jsonBody

def json_pack(body):
    return (json.dumps(body)).encode("utf8")

'''Python HTTP Server Class - defines handlers for each request type'''
class HTTPRequestHandler(BaseHTTPRequestHandler):
        def do_HEAD(self):
            print(self)
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()

        '''Respond to a GET request'''
        def do_GET(self):
            '''Construct proper headers'''
            self.send_response(200)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Content-type", "text/html")
            self.end_headers()
            '''Read in client message and check request type'''
            parsed_request = urlparse(self.path)
            resource = parsed_request.path
            if (resource == "/checkTabs"):
                '''Check if a tab has been shared with this client host'''
                (client_host, client_port) = self.client_address
                if (client_host not in address_book):
                    self.wfile.write(json_pack({"error": "Client not registered"}))
                    return
                client_host = address_book[client_host]
                L = URL_hash_table.get(client_host, [])
                '''Remove the client_host-(URL,sender) key-value pair from the hash table'''
                if (L):
                    URL_hash_table.pop(client_host)
                '''Send over URL:sender_host'''
                self.wfile.write(json_pack({"urls": L}))
            elif (resource == "/checkNames"):
                '''Send over a list of all registered names'''
                self.wfile.write(json_pack({"allNames": list(all_names)}))

        '''Respond to a PUT request'''
        def do_POST(self):
            '''Construct proper headers'''
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            '''Read in client message and check request type'''
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            jsonBody = json_unpack(body)
            if (jsonBody["type"] == "share"):
                '''Add the shared tab in the URL dictionary'''
                recipient_host = jsonBody["recipientName"]
                print(recipient_host);
                URL = jsonBody["url"]
                sender_host = address_book[self.client_address[0]]
                if (recipient_host not in all_names):
                    reply = {"error": "This person is not in the address book"}
                    self.wfile.write(json_pack(reply))
                    return
                if (recipient_host not in URL_hash_table):
                    URL_hash_table[recipient_host] = [(URL, sender_host)]
                else:
                    URL_hash_table[recipient_host].append((URL, sender_host))
                self.wfile.write(json_pack({ "success": True }))
            elif (jsonBody["type"] == "register"):
                '''Add the name of this client host in the address book'''
                name = jsonBody["name"]
                if (name in all_names):
                    reply = {"error": 'This client is already registered'}
                    self.wfile.write(json_pack(reply))
                else:
                    (client_host, client_port) = self.client_address
                    address_book[client_host] = name
                    all_names.add(name)
                self.wfile.write(json_pack({"success": True} ))

if __name__ == '__main__':
    httpd = HTTPServer((HOST_NAME, PORT_NUMBER), HTTPRequestHandler)
    print(time.asctime(), "Server Startes = %s:%s" % (HOST_NAME, PORT_NUMBER))
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print(time.asctime(), "Server Stops - %s:%s" % (HOST_NAME, PORT_NUMBER))
