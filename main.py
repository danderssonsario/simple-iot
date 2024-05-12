# This code uses only the MicroPython native libraries to read the temperature and humidity from a DHT11 or DHT22 sensor.
from machine import Pin # Import Pin class from machine module
from time import sleep # Import sleep function from time module
import dht # Import dht module


# Uncomment the sensor you are using, and comment out the other one.
# If you get a Failed to read sensor error, verify that the sensor is connected to the correct pin.
# I use 17 only since it easily exposed on my extension board... you can use any other I/O pin.
sensor = dht.DHT22(Pin(15))
#sensor = dht.DHT11(Pin(17))

while True:
  try:
    sensor.measure()
    sleep(2) # DHT 22 requires 2 seconds to make a reading, DHT 11 *MAY* make a reading faster. so 2 seconds is a safe bet.
    temp = sensor.temperature()
    hum = sensor.humidity()

    print('Temperature: C', temp)

    print('Humidity:', hum)
  except OSError as e:
    # These are hard errors and we want to stop the program
    # This includes things like you pulling a cable out or the sensor not responding
    print('Failed to read sensor.')
    break
  except Exception as e:
    print('An error occurred:', e)
    # These are soft errors and we want to keep the program running, we just ignore them and let the loop run.
    # break
