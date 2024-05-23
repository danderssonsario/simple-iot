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


