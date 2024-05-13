import machine
from time import sleep
from dht import DHT22
import ujson
import network
import ubinascii
from secrets import secrets
from umqtt.simple import MQTTClient

# MQTT settings
MQTT_BROKER = secrets['MQTT_BROKER']
MQTT_CLIENT_ID = ubinascii.hexlify(machine.unique_id())
TEMPERATURE_FEED = secrets['TEMPERATURE_FEED']
HUMIDITY_FEED = secrets['HUMIDITY_FEED']
PORT = secrets['PORT']
MQTT_USERNAME = secrets['MQTT_USERNAME']
MQTT_PASSWORD = secrets['MQTT_PASSWORD']

# DHT22 sensor pin
DHT_PIN = 15  # Pin GP4 on Raspberry Pi Pico W

# Initialize DHT22 sensor
dht = DHT22(machine.Pin(DHT_PIN))


# MQTT callback function
def mqtt_callback(topic, msg):
    print("Received MQTT message on topic:", topic)
    print("Message:", msg)
    # Implement your control logic here based on received MQTT messages
    # For example, control the LED based on received commands

# Connect to MQTT broker
mqtt_client = MQTTClient(MQTT_CLIENT_ID, MQTT_BROKER, PORT, MQTT_USERNAME, MQTT_PASSWORD)
#mqtt_client.set_callback(mqtt_callback)
mqtt_client.connect()
#mqtt_client.subscribe(b"LED")  # Subscribe to LED control topic

# Main loop
while True:
  try:
      # Read temperature and humidity data from DHT22 sensor
      dht.measure()
      sleep(2)
      temperature = dht.temperature()
      humidity = dht.humidity()
      print("Temperature:", temperature, "°C")
      print("Humidity:", humidity, "%")

      # Prepare data in JSON format
      temperature_data = {"value": temperature}
      humidity_data = {"value": humidity}

      mqtt_client.publish(TEMPERATURE_FEED, ujson.dumps(temperature_data))
      mqtt_client.publish(HUMIDITY_FEED, ujson.dumps(humidity_data))

      # Sleep for 60 seconds before next reading
      sleep(3)
  except OSError as e:
    print('Failed to read sensor,')
    break
  except Exception as e:
    print('An error occured:', e)
      

