import network
import socket
from secrets import secrets

# WiFi settings
ssid = secrets['WIFI_SSID']
password = secrets['WIFI_PASSWORD']

station = network.WLAN(network.STA_IF)
station.active(True)
station.connect(ssid, password)

while station.isconnected() == False:
    pass

print('Connection')
print(station.ifconfig())

#addr = socket.getaddrinfo('micropython.org', 80)[0][-1]
#s = socket.socket()
#s.connect(addr)
#s.send(b'GET / HTTP/1.1\r\nHost: micropython.org\r\n\r\n')
#data = s.recv(1000)
#print(data)
#s.close()

