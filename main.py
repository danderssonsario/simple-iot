from machine import Pin, reset
from time import sleep, time
from dht import DHT22
import ujson
import network
import ubinascii
from secrets import secrets
from umqtt.simple import MQTTClient
import uselect

# MQTT settings
MQTT_BROKER = secrets['MQTT_BROKER']
MQTT_CLIENT_ID = secrets['MQTT_CLIENT_ID']
TEMPERATURE_FEED = secrets['TEMPERATURE_FEED']
HUMIDITY_FEED = secrets['HUMIDITY_FEED']
LED_FEED = secrets['LED_FEED']
PORT = secrets['PORT']
MQTT_USERNAME = secrets['MQTT_USERNAME']
MQTT_PASSWORD = secrets['MQTT_PASSWORD']

# DHT22 sensor pin
DHT_PIN = 15  # Pin GP15 on Raspberry Pi Pico W

# Initialize DHT22 sensor
dht = DHT22(Pin(DHT_PIN))

led = Pin("LED", Pin.OUT)

# MQTT callback function
def mqtt_callback(topic, msg):
    print("Received MQTT message on topic:", topic)
    print("Message:", msg)
    if msg == b'1':
        led.value(1)
    elif msg == b'0':
        led.value(0)

# Connect to MQTT broker
mqtt_client = MQTTClient(MQTT_CLIENT_ID, MQTT_BROKER, PORT, MQTT_USERNAME, MQTT_PASSWORD)
mqtt_client.set_callback(mqtt_callback)
mqtt_client.connect()
mqtt_client.subscribe(LED_FEED)

# Sync led with MQTT
led.value(1)
mqtt_client.publish(LED_FEED, '0')

# Counter for OSError resets
reset_counter = 0
MAX_RESETS = 3

# Interval for sensor reading (in seconds)
SENSOR_READ_INTERVAL = 10
last_sensor_read_time = time()

# Create a poll object
poll = uselect.poll()
poll.register(mqtt_client.sock, uselect.POLLIN)

# Main loop
while True:
    try:
        # Wait for incoming MQTT messages or timeout
        events = poll.poll(6000)  # timeout in milliseconds
        if events:
            mqtt_client.check_msg()

        # Read sensor data at intervals
        current_time = time()
        if current_time - last_sensor_read_time >= SENSOR_READ_INTERVAL:
            last_sensor_read_time = current_time

            # Read temperature and humidity data from DHT22 sensor
            dht.measure()
            temperature = dht.temperature()
            humidity = dht.humidity()
            print("Temperature:", temperature, "°C")
            print("Humidity:", humidity, "%")

            # Prepare data in JSON format
            temperature_data = {"value": temperature}
            humidity_data = {"value": humidity}

            mqtt_client.publish(TEMPERATURE_FEED, ujson.dumps(temperature_data))
            mqtt_client.publish(HUMIDITY_FEED, ujson.dumps(humidity_data))

    except OSError as e:
        print('Failed to read sensor,')
        print('Resetting...')
        reset_counter += 1
        if reset_counter >= MAX_RESETS:
            print(f"Failed {MAX_RESETS} times. Exiting...")
            break
        sleep(5)
    except Exception as e:
        print('An error occurred:', e)
        print('Resetting...')
        sleep(5)
        reset()

