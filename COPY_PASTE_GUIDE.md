# Copy/Paste OEBB Sensors Directly into configuration.yaml

## Quick Instructions

1. Open your `configuration.yaml` file
2. Find your `sensor:` section
3. Go to the bottom of your sensor list
4. Copy the content from `oebb-sensors-direct.yaml`
5. Paste it at the bottom (before the closing of sensor section)
6. Save and restart Home Assistant

## Example: Your configuration.yaml should look like

```yaml
sensor:
  # Your existing sensors stay exactly as-is
  - platform: template
    sensors:
      solar_saving_total_old_price:
        friendly_name: "Euros saved using Solar total old price"
        unique_id: euros_saved_using_solar_total_old_price
        unit_of_measurement: '€'
        icon_template: mdi:currency-eur
        value_template: >-
           {{ ((states('sensor.hoymiles_1600_yieldtotal') | float * 0.40) )| round(2)  }}
           
  - platform: template
    sensors:
      solar_saving_total_new_price:
        friendly_name: "Euros saved using Solar total new price"
        unique_id: euros_saved_using_solar_total_new_price
        unit_of_measurement: '€'
        icon_template: mdi:currency-eur
        value_template: >-
           {{ ((states('sensor.hoymiles_1600_yieldtotal') | float * 0.13) )| round(2)  }}           

  # ... all your other sensors ...
  
  # ÖBB Train Checker Sensors - ADD THESE AT THE BOTTOM
  - platform: rest
    name: OEBB Trains
    resource: http://localhost:3000/api/trains
    scan_interval: 300
    json_attributes:
      - trains
      - from
      - to
      - count
      - lastUpdate
      - status
    value_template: "{{ value_json.status }}"

  - platform: rest
    name: OEBB Next Train
    resource: http://localhost:3000/api/trains/next
    scan_interval: 300
    json_attributes:
      - train
      - lastUpdate
      - status
    value_template: >
      {% if value_json.train %}
        {{ value_json.train.line }} at {{ as_timestamp(value_json.train.departure.time) | timestamp_custom('%H:%M') }}
      {% else %}
        No trains
      {% endif %}

  - platform: rest
    name: OEBB Next Train Line
    resource: http://localhost:3000/api/trains/next
    scan_interval: 300
    value_template: "{{ value_json.train.line | default('N/A') }}"

  - platform: rest
    name: OEBB Next Train Departure
    resource: http://localhost:3000/api/trains/next
    scan_interval: 300
    value_template: >
      {% if value_json.train and value_json.train.departure.time %}
        {{ as_timestamp(value_json.train.departure.time) | timestamp_custom('%H:%M') }}
      {% else %}
        N/A
      {% endif %}

  - platform: rest
    name: OEBB Next Train Delay
    resource: http://localhost:3000/api/trains/next
    scan_interval: 300
    unit_of_measurement: "min"
    value_template: "{{ value_json.train.departure.delayMinutes | default(0) }}"

  - platform: rest
    name: OEBB Next Train Cancelled
    resource: http://localhost:3000/api/trains/next
    scan_interval: 300
    value_template: "{{ value_json.train.cancelled | default(false) }}"

  - platform: rest
    name: OEBB Next Train Platform
    resource: http://localhost:3000/api/trains/next
    scan_interval: 300
    value_template: "{{ value_json.train.departure.platform | default('N/A') }}"

  - platform: rest
    name: OEBB Next Train Arrival
    resource: http://localhost:3000/api/trains/next
    scan_interval: 300
    value_template: >
      {% if value_json.train and value_json.train.arrival.time %}
        {{ as_timestamp(value_json.train.arrival.time) | timestamp_custom('%H:%M') }}
      {% else %}
        N/A
      {% endif %}
```

## Steps

1. **Remove** this line from your `configuration.yaml`:
   ```yaml
   - !include oebb-sensors.yaml
   ```

2. **Copy all 8 sensors** from `oebb-sensors-direct.yaml`

3. **Paste them** at the bottom of your `sensor:` section (after your solar sensors)

4. **Save** the file

5. **Restart** Home Assistant

That's it! No include files, no directory structure - just direct paste into configuration.yaml.

