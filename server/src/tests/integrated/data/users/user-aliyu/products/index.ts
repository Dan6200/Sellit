// cspell:disable
import {
  ProductRequestData,
  ProductMedia,
  ProductRequestPartial,
} from '#src/types/products.js'

export const products: ProductRequestData[] = [
  {
    title:
      'Apple AirPods Pro (2nd Generation) Wireless Earbuds, Up to 2X More Active Noise Cancelling, Adaptive Transparency, Personalized Spatial Audio, MagSafe Charging Case, Bluetooth Headphones for iPhone',
    category_id: 1,
    subcategory_id: 1,
    description: [
      `* 1.69" HD Full Touch Screen: High texture watch frame with 1.69" LCD full touch colorful screen bring comfortable touch and excellent visual experience.`,
      `There are various watch face styles to choose from in the app. Also you can choose a picture you like to customize the watch face in "QWatch Pro" App. And the smartwatch screen will light up every time you raise your hand.`,
      `Note: Products with electrical plugs are designed for use in the US. Outlets and voltage differ internationally and this product may require an adapter or converter for use in your destination. Please check compatibility before purchasing.\n`,
    ],
    list_price: 35000,
    net_price: 30000,
    quantity_available: 17,
  },
  {
    title:
      'Bose QuietComfort 45 Bluetooth Wireless Noise Cancelling Headphones - White Smoke',
    category_id: 1,
    subcategory_id: 1,
    description: [
      'Noise cancelling wireless headphones: The perfect balance of quiet, comfort, and sound. Bose uses tiny mics to measure, compare, and react to outside noise, cancelling it with opposite signals. Bluetooth range-up to 9 m (30 feet).',
      'HIGH-FIDELITY AUDIO: The TriPort acoustic architecture offers depth and fullness. Volume-optimized Active EQ maintains balanced performance at any volume, so bass stays consistent when turned down and the music remains clear when turned up.',
      'QUIET AND AWARE MODES: Choose Quiet Mode for full noise cancelling, or Aware Mode to bring the outside into the around ear headphones and hear your environment and your music at the same time.',
      'UP TO 22 HOURS BATTERY LIFE: Enjoy 22 hours of battery life from a single charge. A quick 15-minute charge offers 3 hours when you’re on the go, or plug in the included audio cable to listen for even longer in wired mode.',
      'PERSONALIZE YOUR AUDIO: Adjustable EQ allows you to set the bass, mid-range, and treble levels to your personal preferences or select one of several preset options.',
      'BOSE SIMPLESYNC TECHNOLOGY: SimpleSync pairs your Bose QuietComfort 45 headphones with select Bose smart soundbars for a personal TV listening experience. Independent volume controls allow you to lower or mute your soundbar while keeping your headphones as loud as you like.Away from your phone. Press and hold the Bluetooth button on each device to sync their sound. Already got a group going. Link by pressing the Action button to connect at a moment’s notice.',
    ],
    list_price: 194242.5,
    net_price: 225000,
    quantity_available: 18,
  },
  {
    title:
      'Fitbit Charge 5 Advanced Health & Fitness Tracker with Built-in GPS, Stress Management Tools, Sleep Tracking, 24/7 Heart Rate and More, Black/Graphite, One Size (S &L Bands Included)',
    category_id: 1,
    subcategory_id: 1,
    description: [
      'Optimize your workout routine with a Daily Readiness Score that reveals if you’re ready to exercise or should focus on recovery (Requires Fitbit Premium membership). Compatibility-Apple iOS 15 or higher, Android OS 9 or higher',
      `Get a daily Stress Management Score showing your body’s response to stress and take steps to improve your levels with an on-wrist EDA sensor mindfulness session. Band Size:Sm: Fits wrist 5.1"- 6.7" . Lrg: Fits wrist 6.7" - 8.3" in circumference`,
      'Track your heart health with high & low heart rate notifications and a compatible ECG app (The Fitbit ECG app is available in select countries. Not intended for use by people under 22 years old.)',
      'With the Health Metrics dashboard, track SpO2, heart rate variability, skin temperature variation and more (Not intended to diagnose or treat any medical condition and should not be relied on for any medical purposes.)',
      'See your real-time pace & distance without your phone using built-in GPS during outdoor activity, then see a map of your workout route in the Fitbit app',
      'Your stats come to life on a new color touchscreen that’s two times brighter than Charge 4 in daylight, all with up to 7-day battery (varies with use and other factors)',
      'Track calorie burn and optimize workouts with 24/7 heart rate tracking and Active Zone Minutes, which guide you toward your desired intensity level',
      'Get a better understanding of your sleep quality with a daily Sleep Score and graphs of your time in light, deep and REM sleep—then see how you can improve your sleep and wake up feeling energized',
      'Includes a 6-month Premium membership complete with personalized insights, advanced analytics, guided programs and more (New & returning Premium users only. Must activate trial within 60-days of device activation. Content and features may change)',
    ],
    list_price: 89962.5,
    net_price: 112500,
    quantity_available: 7,
  },
]

export const productReplaced: ProductRequestData[] = [
  {
    title:
      'Apple AirPods Pro (2nd Generation) Wireless Earbuds, Up to 2X More Active Noise Cancelling, Adaptive Transparency, Personalized Spatial Audio, MagSafe Charging Case, Bluetooth Headphones for iPhone',
    category_id: 1,
    subcategory_id: 1,
    description: [
      `* 1.69" HD Full Touch Screen: High texture watch frame with 1.69" LCD full touch colorful screen bring comfortable touch and excellent visual experience.`,
      `There are various watch face styles to choose from in the app. Also you can choose a picture you like to customize the watch face in "QWatch Pro" App. And the smartwatch screen will light up every time you raise your hand.`,
      `Note: Products with electrical plugs are designed for use in the US. Outlets and voltage differ internationally and this product may require an adapter or converter for use in your destination. Please check compatibility before purchasing.\n`,
    ],
    list_price: 35000,
    net_price: 30000,
    quantity_available: 17,
  },
  {
    title:
      'Bose QuietComfort 45 Bluetooth Wireless Noise Cancelling Headphones - White Smoke',
    category_id: 1,
    subcategory_id: 1,
    description: [
      'Noise cancelling wireless headphones: The perfect balance of quiet, comfort, and sound. Bose uses tiny mics to measure, compare, and react to outside noise, cancelling it with opposite signals. Bluetooth range-up to 9 m (30 feet).',
      'HIGH-FIDELITY AUDIO: The TriPort acoustic architecture offers depth and fullness. Volume-optimized Active EQ maintains balanced performance at any volume, so bass stays consistent when turned down and the music remains clear when turned up.',
      'QUIET AND AWARE MODES: Choose Quiet Mode for full noise cancelling, or Aware Mode to bring the outside into the around ear headphones and hear your environment and your music at the same time.',
      'UP TO 22 HOURS BATTERY LIFE: Enjoy 22 hours of battery life from a single charge. A quick 15-minute charge offers 3 hours when you’re on the go, or plug in the included audio cable to listen for even longer in wired mode.',
      'PERSONALIZE YOUR AUDIO: Adjustable EQ allows you to set the bass, mid-range, and treble levels to your personal preferences or select one of several preset options.',
      'BOSE SIMPLESYNC TECHNOLOGY: SimpleSync pairs your Bose QuietComfort 45 headphones with select Bose smart soundbars for a personal TV listening experience. Independent volume controls allow you to lower or mute your soundbar while keeping your headphones as loud as you like.Away from your phone. Press and hold the Bluetooth button on each device to sync their sound. Already got a group going. Link by pressing the Action button to connect at a moment’s notice.',
    ],
    list_price: 194242.5,
    net_price: 225000,
    quantity_available: 18,
  },
  {
    title:
      'Fitbit Charge 5 Advanced Health & Fitness Tracker with Built-in GPS, Stress Management Tools, Sleep Tracking, 24/7 Heart Rate and More, Black/Graphite, One Size (S &L Bands Included)',
    category_id: 1,
    subcategory_id: 1,
    description: [
      'Optimize your workout routine with a Daily Readiness Score that reveals if you’re ready to exercise or should focus on recovery (Requires Fitbit Premium membership). Compatibility-Apple iOS 15 or higher, Android OS 9 or higher',
      `Get a daily Stress Management Score showing your body’s response to stress and take steps to improve your levels with an on-wrist EDA sensor mindfulness session. Band Size:Sm: Fits wrist 5.1"- 6.7" . Lrg: Fits wrist 6.7" - 8.3" in circumference`,
      'Track your heart health with high & low heart rate notifications and a compatible ECG app (The Fitbit ECG app is available in select countries. Not intended for use by people under 22 years old.)',
      'With the Health Metrics dashboard, track SpO2, heart rate variability, skin temperature variation and more (Not intended to diagnose or treat any medical condition and should not be relied on for any medical purposes.)',
      'See your real-time pace & distance without your phone using built-in GPS during outdoor activity, then see a map of your workout route in the Fitbit app',
      'Your stats come to life on a new color touchscreen that’s two times brighter than Charge 4 in daylight, all with up to 7-day battery (varies with use and other factors)',
      'Track calorie burn and optimize workouts with 24/7 heart rate tracking and Active Zone Minutes, which guide you toward your desired intensity level',
      'Get a better understanding of your sleep quality with a daily Sleep Score and graphs of your time in light, deep and REM sleep—then see how you can improve your sleep and wake up feeling energized',
      'Includes a 6-month Premium membership complete with personalized insights, advanced analytics, guided programs and more (New & returning Premium users only. Must activate trial within 60-days of device activation. Content and features may change)',
    ],
    list_price: 89962.5,
    net_price: 112500,
    quantity_available: 7,
  },
]

export const productPartialUpdate: ProductRequestPartial[] = [
  {
    category_id: 2,
    list_price: 35000,
    net_price: 30000,
    quantity_available: 17,
  },

  {
    description: [
      `TRUE WIRELESS EARBUDS WITH RICH, BALANCED SOUND — Hear it loud and clear with 12mm drivers delivering crisp audio, balanced bass, and full sound. Be heard with 2 microphones and a voice detection accelerometer for crystal clear communication.`,
      `ALEXA ON-THE-GO — Cue music, play podcasts, listen to Audible, make calls, set reminders, and more, all with the sound of your voice. Compatible with iOS and Android, and supports access to Siri and Google Assistant.`,
    ],

    net_price: 35000,
  },

  {
    title: `Lenovo Tab M10 Plus 3rd Gen Tablet - 10" FHD - Android 12-32GB Storage - Long Battery Life`,
    subcategory_id: 2,
    list_price: 100000,
    net_price: 100000,
  },
]

export const productMedia: ProductMedia[][] = [
  [
    {
      name: 'airpods-1',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/airpods/crikey.jpg',
      description: 'Echo Wireless Earbuds',
      is_display_image: true,
      is_landing_image: false,
      filetype: 'image',
    },

    {
      name: 'airpods-2',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/bose-headphones/house.jpg',
      description: 'Lenovo Tablet M10 Plus Gen 3',
      is_display_image: false,
      is_landing_image: false,
      filetype: 'image',
    },

    {
      name: 'echo-wireless-buds-3',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/josh.jpg',
      description: 'Lenovo Tablet M10 Plus Gen 3',
      is_display_image: false,
      is_landing_image: false,
      filetype: 'image',
    },

    {
      name: 'echo-wireless-buds-4',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/airpods/crikey.jpg',
      description: 'Lenovo Tablet M10 Plus Gen 3',
      is_display_image: false,
      is_landing_image: false,
      filetype: 'image',
    },

    {
      name: 'echo-wireless-buds-5',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/airpods/display.jpg',
      description: 'Lenovo Tablet M10 Plus Gen 3',
      is_display_image: false,
      is_landing_image: false,
      filetype: 'image',
    },

    {
      name: 'echo-wireless-buds-6',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/airpods/crikey.jpg',
      description: 'Lenovo Tablet M10 Plus Gen 3',
      is_display_image: false,
      is_landing_image: false,
      filetype: 'image',
    },

    {
      name: 'echo-wireless-buds-7',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/airpods/cat.jpg',
      description: 'Lenovo Tablet M10 Plus Gen 3',
      is_display_image: false,
      is_landing_image: false,
      filetype: 'image',
    },

    {
      name: 'echo-wireless-buds-8',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/airpods/cat.jpg',
      description: 'Lenovo Tablet M10 Plus Gen 3',
      is_display_image: false,
      is_landing_image: false,
      filetype: 'image',
    },

    {
      name: 'echo-wireless-buds-9',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/bose-headphones/blake.jpg',
      description: 'Lenovo Tablet M10 Plus Gen 3',
      is_display_image: false,
      is_landing_image: false,
      filetype: 'image',
    },
  ],
  [
    {
      name: 'lenovo-tab-1',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/bose-headphones/blake.jpg',
      description: 'Lenovo Tablet M10 Plus Gen 3',
      is_display_image: true,
      is_landing_image: false,
      filetype: 'image',
    },

    {
      name: 'lenovo-tab-2',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/bose-headphones/random.jpg',
      description: 'Lenovo Tablet M10 Plus Gen 3',
      is_display_image: false,
      is_landing_image: false,
      filetype: 'image',
    },

    {
      name: 'lenovo-tab-3',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/bose-headphones/random.jpg',
      description: 'Lenovo Tablet M10 Plus Gen 3',
      is_display_image: false,
      is_landing_image: false,
      filetype: 'image',
    },

    {
      name: 'lenovo-tab-4',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/airpods/display.jpg',
      description: 'Lenovo Tablet M10 Plus Gen 3',
      is_display_image: false,
      is_landing_image: false,
      filetype: 'image',
    },

    {
      name: 'lenovo-tab-5',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/airpods/display.jpg',
      description: 'Lenovo Tablet M10 Plus Gen 3',
      is_display_image: false,
      is_landing_image: false,
      filetype: 'image',
    },

    {
      name: 'lenovo-tab-6',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/airpods/display.jpg',
      description: 'Lenovo Tablet M10 Plus Gen 3',
      is_display_image: false,
      is_landing_image: false,
      filetype: 'image',
    },
  ],

  [
    {
      name: 'echo-wireless-buds-1',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/airpods/display.jpg',
      description: 'Echo Wireless Earbuds',
      is_display_image: true,
      is_landing_image: false,
      filetype: 'image',
    },

    {
      name: 'echo-wireless-buds-2',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/airpods/display.jpg',
      description: 'Lenovo Tablet M10 Plus Gen 3',
      is_display_image: false,
      is_landing_image: false,
      filetype: 'image',
    },

    {
      name: 'echo-wireless-buds-3',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/airpods/display.jpg',
      description: 'Lenovo Tablet M10 Plus Gen 3',
      is_display_image: false,
      is_landing_image: false,
      filetype: 'image',
    },

    {
      name: 'echo-wireless-buds-4',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/airpods/display.jpg',
      description: 'Lenovo Tablet M10 Plus Gen 3',
      is_display_image: false,
      is_landing_image: false,
      filetype: 'image',
    },

    {
      name: 'echo-wireless-buds-5',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/airpods/display.jpg',
      description: 'Lenovo Tablet M10 Plus Gen 3',
      is_display_image: false,
      is_landing_image: false,
      filetype: 'image',
    },

    {
      name: 'echo-wireless-buds-7',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/airpods/display.jpg',
      description: 'Lenovo Tablet M10 Plus Gen 3',
      is_display_image: false,
      is_landing_image: false,
      filetype: 'image',
    },

    {
      name: 'echo-wireless-buds-8',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/airpods/display.jpg',
      description: 'Lenovo Tablet M10 Plus Gen 3',
      is_display_image: false,
      is_landing_image: false,
      filetype: 'image',
    },

    {
      name: 'echo-wireless-buds-9',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/airpods/display.jpg',
      description: 'Lenovo Tablet M10 Plus Gen 3',
      is_display_image: false,
      is_landing_image: false,
      filetype: 'image',
    },
  ],
  [
    {
      name: 'lenovo-tab-1',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/airpods/display.jpg',
      description: 'Lenovo Tablet M10 Plus Gen 3',
      is_display_image: true,
      is_landing_image: false,
      filetype: 'image',
    },

    {
      name: 'lenovo-tab-2',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/airpods/display.jpg',
      description: 'Lenovo Tablet M10 Plus Gen 3',
      is_display_image: false,
      is_landing_image: false,
      filetype: 'image',
    },

    {
      name: 'lenovo-tab-3',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/airpods/display.jpg',
      description: 'Lenovo Tablet M10 Plus Gen 3',
      is_display_image: false,
      is_landing_image: false,
      filetype: 'image',
    },

    {
      name: 'lenovo-tab-4',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/airpods/display.jpg',
      description: 'Lenovo Tablet M10 Plus Gen 3',
      is_display_image: false,
      is_landing_image: false,
      filetype: 'image',
    },

    {
      name: 'lenovo-tab-5',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/airpods/display.jpg',
      description: 'Lenovo Tablet M10 Plus Gen 3',
      is_display_image: false,
      is_landing_image: false,
      filetype: 'image',
    },

    {
      name: 'lenovo-tab-6',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/airpods/display.jpg',
      description: 'Lenovo Tablet M10 Plus Gen 3',
      is_display_image: false,
      is_landing_image: false,
      filetype: 'image',
    },
  ],
]

// TODO: should be a matrix
export const updatedProductMedia: ProductMedia[][] = [
  [
    {
      name: 'tozo-smartwatch-1',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/airpods/display.jpg',
      description: 'A fitness smartwatch',
      is_display_image: false,
      is_landing_image: false,
      filetype: 'image',
    },

    {
      name: 'tozo-smartwatch-2',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/airpods/display.jpg',
      description: 'A fitness smartwatch',
      is_display_image: false,
      is_landing_image: false,
      filetype: 'image',
    },

    {
      name: 'tozo-smartwatch-3',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/airpods/display.jpg',
      description: 'A fitness smartwatch',
      is_display_image: false,
      is_landing_image: false,
      filetype: 'image',
    },

    {
      name: 'tozo-smartwatch-4',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/airpods/display.jpg',
      description: 'A fitness smartwatch',
      is_display_image: false,
      is_landing_image: false,
      filetype: 'image',
    },

    {
      name: 'tozo-smartwatch-5',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/airpods/display.jpg',
      description: 'A fitness smartwatch',
      is_display_image: false,
      is_landing_image: false,
      filetype: 'image',
    },

    {
      name: 'tozo-smartwatch-6',
      path: './server/src/tests/integrated/data/users/user-aliyu/products/media/',
      description: 'A fitness smartwatch',
      is_display_image: false,
      is_landing_image: false,
      filetype: 'image',
    },
  ],
]
