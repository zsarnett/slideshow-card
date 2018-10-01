# Slideshow Card

Slideshow Card for Home Assistant's UI LoveLace

## Configuration Variables

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `custom:slideshow-card`
| cards | list | **Required**/**Optional** | List of cards `Reqires 2 or more cards` `Only Optional if folder=true`
| style | list | **Optional** | List of Style attributes
| arrow_color | string | **Optional** | Color of the Navigational Arrows, `Default: Black`
| arrow_opacity | string | **Optional** | Opacity of the Navigational Arrows, `Default: 1`
| flush | boolean | **Optional** | Makes the inner Cards flush with the Slideshow Card, `Default: false`
| auto_play | boolean | **Optional** | Option to turn on/off auto switching of the cards, `Default: false`
| auto_delay | string | **Optional** | Seconds between switching to next card when autoplay=true, `Default: 5`
| folder | entity | **Optional** | This is for dynamically pulling images from a folder `See Dynamic Slideshow`


## Added Child Card Variables

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| style | list | **Optional** | List of Style Attributes per Card - This allows for styling of Child Cards

## Dynamic Slideshow

This allows you add images to a folder in your WWW folder that contains images you would like the see in the slideshow. Currently, this requires over writing the Folder Sensor so that the client can see the files. I am working on a built in method but wanted to get this feature available.

You will need to create a folder in your config directory named `custom_components`, within the custom_components folder you will need to create a `sensor` folder, and within that folder copy the `folder.py` file. 

1. Create a folder in your `config` directory named `custom_components`
2. Create a folder in your `custom_components` named `sensor`
3. Copy the `folder.py` into the `sensor` folder
4. Added the folder sensor to your configuration.yaml file
    ```yaml
    - sensor
        - platform: folder_test
          folder: /config/www/images
    ```
5. Create a folder in your `WWW` folder named `images`
6. Add your images to this folder
7. Restart Home Assistant
8. Check the sensor.images entity to see if the `fileList` attribute lists your image files
9. Add a card to your ui-lovelace.yaml
    ```yaml
    - type: custom:slideshow-card
      folder: sensor.images
    ```
    * The other configuration variables are still available to use
10. Refresh your Lovelace Frontend

Any files you add to the folder should automatically get added to the slide show


## Installation

1. Copy `slideshow-card.js` to `<config directory>/www/slideshow-card.js`
2. Add `slideshow-card` as a resource in `ui-lovelace.yaml`

```yaml
resources:
  - url: /local/slideshow-card.js
    type: js
```

## Example Configuration

```yaml
- type: custom:slideshow-card
  flush: true
  arrow_color: White
  arrow_opacity: .5
  auto_play: true
  auto_delay: 4
  style:
    'border-radius': '25px'
  cards:
    - type: picture
      image: /local/images/1.jpg
    - type: picture
      image: /local/images/2.jpg
    - type: picture
      image: /local/images/3.jpg
```

![Example 1](https://i.gyazo.com/2ec6758472c4802cac7deb4f2beb777e.gif)

```yaml
- type: custom:slideshow-card
  arrow_color: var(--primary-text-color)
  arrow_opacity: .7
  cards:
    - type: glance
      column_width: 30%
      entities:
        - entity: device_tracker.person1
          name: Person 1
        - entity: device_tracker.person2
          name: Person 2
        - entity: sensor.house_alarm_sensor
        - entity: sensor.to_work
          icon: mdi:car
          name: To Work
        - entity: sensor.to_store
          icon: mdi:car
          name: To Store
    - type: glance
      column_width: 30%
      entities:
        - entity: light.light_1
          name: Light 1
          tap_action: toggle
        - entity: light.light_2
          name: Light 2
          tap_action: toggle
        - entity: light.light_3
          name: Light 3
          tap_action: toggle
        - light.office_1
        - light.office_2
    - type: glance
      column_width: 30%
      entities:
        - light.bedroom_1
        - light.bedroom_2
        - light.bedroom_3
        - light.bedroom_lamp_2
```

![Example 2](https://i.gyazo.com/9a344f995906b43e42b8be85e9c8d675.gif)

```yaml
- type: custom:slideshow-card
  arrow_color: var(--primary-text-color)
  arrow_opacity: .5
  cards:
    - type: picture
      image: /local/images/1.jpg
      style:
        'border-radius': '25px'
    - type: picture
      image: /local/images/2.jpg
    - type: picture
      image: /local/images/3.jpg
      style:
        'border-radius': '10px'
```

![Example 3](https://i.gyazo.com/662d39821d47a6131daf235a6876cf41.gif)

## Future Updates
* Option for Outer Card to stay the max-height of any card in the Slideshow
  * This removes the height chainging when switching cards
* Adding Swiping Gestures for Mobile use

## Credits

Thank you to @thomasloven for his [Custom Cards](https://community.home-assistant.io/t/my-lovelace-plugins/70726) to work from and his help when creating this card
