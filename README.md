# Assignment - Track my room
### Daniel Andersson | da222xg | approx 40 hours work

## Note
My 'backend' folder is not really used in this project because: 1. Adafruit's API did not support webhooks the way i anticipated, 2. I want to keep it to work on another solution in the future, but did not have the time to do it now.

This project uses a Raspberry Pi Pico W and a DHT22 sensor to collect temperature and humidity data and transmit it using the MQTT protocol to an Adafruit IO broker. The collected data is then visualized through an Angular-based web frontend, providing users with a clear and interactive dashboard to monitor their environment. Additionally, the system features an LED that can be remotely controlled via MQTT messages.

## Objective

The objective of this project is to develop an IoT-based environmental monitoring system capable of tracking and visualizing real-time temperature and humidity data. The data collected can provide valuable insights into environmental conditions,

I chose to build this system to explore the practical applications of IoT technologies and to understand the integration of hardware and software components. The project offers a hands-on experience with sensors, microcontrollers, and data communication protocols, making it an excellent learning opportunity. Additionally, the ability to visualize real-time data through a web-based interface adds an extra layer of utility and user engagement.

The primary purpose of this device is to continuously monitor environmental conditions, specifically temperature and humidity. This can be developed further and used in various scenarios:

- **Home Automation**: Monitor indoor climate to maintain comfort and efficiency in heating, ventilation, and air conditioning (HVAC) systems.
- **Agriculture**: Track greenhouse conditions to optimize plant growth and yield by maintaining ideal temperature and humidity levels.
- **Industrial Monitoring**: Ensure that sensitive environments, such as server rooms or manufacturing facilities, remain within specified environmental parameters to prevent equipment damage or production issues.

By collecting and analyzing environmental data, this project aims to provide several insights:

- **Environmental Trends**: Understanding how temperature and humidity fluctuate over time can help in identifying patterns and predicting future conditions.
- **Efficiency Improvements**: Data-driven decisions can optimize the operation of HVAC systems, potentially leading to energy savings and improved efficiency.
- **Preventive Maintenance**: Continuous monitoring allows for early detection of abnormal conditions that might indicate equipment failure or other issues, enabling timely interventions.
- **Comfort and Productivity**: Maintaining optimal environmental conditions can improve comfort in living spaces and productivity in work environments.

## Material

The hardware included in this project:
- **Raspberry Pico WH**
  - **Function**: The microcontroller unit (MCU) that serves as the main processing unit for the project, managing sensor data collection and communication with the MQTT broker.
  - **Specifications**: 
    - Processor: Dual-core Arm Cortex-M0+ processor
    - Connectivity: 2.4GHz 802.11n wireless LAN (WiFi)
    - GPIO: 26 multi-function GPIO pins
    - Cost: 87.20 kr
  - **Bought**: [electrokit](https://www.electrokit.com/raspberry-pi-pico-wh)

- **DHT22 Sensor**
  - **Function**: Measures the ambient temperature and humidity.
  - **Specifications**: 
    - Temperature Range: -40 to 80°C, ±0.5°C accuracy
    - Humidity Range: 0-100%, ±2-5% accuracy
    - Resistor: 4.7K - 10K used as a pullup from data pin to VCC
    - Cost: 103.20 kr
  - **Bought**: [electrokit](https://www.electrokit.com/temp/fuktsensor-dht22)

### Other

- **Breadboard**
  - **Function**: Used for building and testing circuits.
  - **Specifications**: 
    - Measurements: 82 x 55 mm
    - Tie Points: 400
    - Cost: 39.20 kr
  - **Bought**: [electrokit](https://www.electrokit.com/kopplingsdack-400-anslutningar)

- **Jumper wires 10-pack**
  - **Function**: Connects components on a breadboard.
  - **Specifications**: 
    - Quantity used: 5
    - Type: male to male
    - Cost: 23.20 kr
  - **Bought**: [electrokit](https://www.electrokit.com/labsladd-1-pin-hane-hane-150mm-10-pack)

- **USB-Cable**
  - **Function**: Connects and supplies power to the Raspberry Pi Pico.
  - **Specifications**: 
    - Type: A-male to micro-B male
    - Length: 30 cm
    - Cost: 15.20 kr
  - **Bought**: [electrokit](https://www.electrokit.com/usb-kabel-a-hane-micro-b-hane-30cm)

## Computer setup
### IDE: Thonny
Thonny is the Integrated Development Environment (IDE) chosen for programming the Raspberry Pi Pico W in MicroPython. Thonny is beginner-friendly and provides a simple interface for writing and uploading code to microcontrollers.

### Uploading Code
- **Installing Thonny IDE**: Download and install Thonny from the official website (https://thonny.org/). Thonny is available for Windows, macOS, and Linux.
- **Flashing the Firmware**: Before uploading code, the MicroPython firmware needs to be flashed onto the Raspberry Pi Pico W. This is done by getting the board into bootloader mode and copying the firmware uf2 file. Files and details can be found [here](https://micropython.org/download/RPI_PICO_W/).
- **Connecting Raspberry Pi Pico W**: Connect the Raspberry Pi Pico W to your computer using a micro USB cable.
- **Opening Thonny IDE**: Launch Thonny IDE and select the correct Python interpreter by navigating to Tools > Options > Interpreter. Choose MicroPython (Raspberry Pi Pico) from the dropdown menu.
- **Writing and Testing Code**: Write your MicroPython code in the Thonny editor. You can test your code by clicking the Run button or pressing F5. Thonny provides a built-in REPL (Read-Eval-Print Loop) for interacting with the MicroPython interpreter.
- **Uploading Code**: To upload your code to the Raspberry Pi Pico W, click on File > Save As to save your code to a file with a .py extension. Then, click on Run > Upload to MicroPython device. Thonny will automatically transfer the code to the Pico W.

## Putting everything together
### Wiring Instructions
- Connect the 3.3V pin (Pin 36) of the Raspberry Pi Pico W to one of the positive (+) rails on the bread board.
- Connect VCC pin of the DHT22 sensor to the same positive (+) rail on the bread board.
- Connect the pullup resistor from the data pin of the DHT22 sensor to the same positive (+) rail of the bread board.
- Connect the ground (GND) pin (Pin 38) of the Raspberry Pi Pico W to one of the ground (-) rails on the bread board.
- Connect GND pin of the DHT22 sensor to the same ground (-) rail on the bread board.
- Connect a GPIO pin (e.g., GP15) of the Raspberry Pi Pico W to the data pin of the DHT22 sensor.
- Connect the USB cable from the computer to the micro USB port of the Raspberry Pi Pico W.

### Considerations
This setup is suitable for development and testing purposes.

- Use the provided 4.7K - 10K resistor as a pull-up resistor for the data pin of the DHT22 sensor to ensure stable communication.
- Ensure that the voltage supplied to the Raspberry Pi Pico W and the DHT22 sensor is within the specified range (3 to 5V). Also, consider the maximum current consumption of the components.
- The DHT22 sensor has a maximum sampling rate of 0.5 Hz (once every 2 seconds). Ensure that your application can accommodate this delay in sensor readings.

While this setup is suitable for development and testing purposes, it can also be used in production with appropriate considerations for reliability, power efficiency, and environmental conditions. Ensure proper enclosure and protection for outdoor deployments.

* The Raspberry Pi Pico W microcontroller is connected to WiFi.
* The Raspberry Pi Pico W microcontroller reads the temperature and humidity data of sensor DHT11.
* The Raspberry Pi Pico W microcontroller sends the temperature and humidity data to the Adafruit MQTT Broker using the MQTT protocol. The data need to be prepared in a JSON format.
* The Raspberry Pi Pico W microcontroller must be controlled by a button on the Adafruit dashboard i.e. if Rpi Pico W receives the command "ON" or "OFF" on the "LED" topic, the built-in LED of Rpi Pico W must be on or off.
* Your git repository should include the assignment report, assignment code, and link to your prerecorded presentation file where you show your hardware (picow+wires+sensor) connection, visualization of data in your dashboard, and turn on/off the PicoW LED (MP4 file). 
* It would be a bonus if you can set up your own MQTT server rather than using Adafruit MQTT Broker.

## The platform
- **Micropython**: MicroPython provides a lightweight and efficient programming environment for microcontrollers like the Raspberry Pi Pico. It offers a familiar Python syntax, making it accessible for beginners and experienced developers alike.
- **Adafruit IOO**: Adafruit IO is a cloud-based platform that enables easy integration of IoT devices with web services. It provides MQTT-based communication for real-time data exchange and dashboard visualization tools for monitoring sensor data.

### Why
- **Familiarity**: Python is widely used and known for its simplicity and readability. MicroPython brings the power of Python to microcontrollers, allowing rapid development without sacrificing performance.
- **Raspberry Pi Pico**: The Raspberry Pi Pico offers a cost-effective and versatile microcontroller platform with ample GPIO pins and onboard peripherals.
- **Ease of Use**: Adafruit IO provides a user-friendly interface for managing IoT devices, creating dashboards, and visualizing sensor data.
- **MQTT Integration**: MQTT is a lightweight and efficient protocol for IoT communication. Adafruit IO supports MQTT, enabling seamless integration with MicroPython on the Raspberry Pi Pico.

### The web app
The web app is deployed using Netlify at the url: [https://extraordinary-melba-f492c5.netlify.app/](https://extraordinary-melba-f492c5.netlify.app/)

## Code examples
```python
def mqtt_callback(topic, msg):
    print("Received MQTT message on topic:", topic)
    print("Message:", msg)
    if msg == b'1':
        led.value(1)
    elif msg == b'0':
        led.value(0)
```
This MQTT callback function listens for incoming messages, prints the topic and message, and toggles an LED based on the received message, turning it on for '1' and off for '0'.

```python
events = poll.poll(1000)  # timeout in milliseconds
if events:
    mqtt_client.check_msg()
```
Utilizes polling with a timeout of 6000 milliseconds to check for events. If any events are detected within the specified timeout, the mqtt_client.check_msg() function is called to handle incoming MQTT messages. Importantly, this method does not block the execution of other tasks or the event queue, allowing the program to continue its operations while concurrently processing MQTT messages.

```python
dht.measure()
temperature = dht.temperature()
humidity = dht.humidity()

temperature_data = {"value": temperature}
humidity_data = {"value": humidity}

mqtt_client.publish(TEMPERATURE_FEED, ujson.dumps(temperature_data))
mqtt_client.publish(HUMIDITY_FEED, ujson.dumps(humidity_data))
```
This code block reads temperature and humidity data from the DHT22 sensor, prepares the data in JSON format, and publishes it to MQTT topics for temperature and humidity feeds, respectively.

## Data flow
The data from the sensor is transmitted to the internet using MQTT (Message Queuing Telemetry Transport) protocol over WiFi connectivity. The data is sent at regular intervals determined by the `SENSOR_READ_INTERVAL`, which is set to every 10 seconds in the code.

The choice of WiFi as the wireless protocol allows for high-speed and reliable data transmission over a local network or the internet, providing sufficient bandwidth for sending sensor data at frequent intervals. MQTT is used as the transport protocol due to its efficient publish-subscribe messaging pattern, enabling real-time communication between the device and the MQTT broker.

After the sensor data is transmitted to the internet using MQTT over WiFi, it is fetched by an Angular web application using HTTP requests to endpoint(s) on Adafruit's IO API. 
For visualization, the Angular web application utilizes charting libraries like Chart.js or D3.js to create an interactive and visually appealing chart. The fetched sensor data is mapped to the appropriate chart components, and the chart are rendered dynamically on the web page.

## Presenting the data
The web app supplies an interactive chart.
When turned on, the pico has regularly measured the temperature and humidity (once per 10 seconds).
The sensor has been turned on day time, on several occasions, since the May 17th.
The data is stored 30 days on Adafruit. If more persistent storage are desired, consider connecting the Adafruit to a backend server with a database.

## Final thoughts
I'm pretty happy with my project. I got something pretty simple but at least it works as desired. Perhaps i will take my chances att further develop this project since it was a very fun one!