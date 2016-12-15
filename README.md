This is a simple progressive web app, that looks up emergency codes sent by the **Wiener Berufsrettung (MA 70)** to other emergency response organisations. 
The app provides a simple description about a lot of codes used, but is not nearly complete.

# API

The backend is a simple API that splits a code into four parts. 

```
17-A-03S

major: 17
priority: A (Alpha)
minor: 03
suffix: S
```

To fetch data about this code use the API endpoint `/codes/:major/:priority/:minor[/:suffix]`, 
that will return a JSON response. Requesting *17-A-03S* will return:

```json
{
  "code": {
    "major": "17",
    "priority": "A",
    "minor": "03",
    "long": "17-A-03S",
    "suffix": "S"
  },
  "lang": "de-AT",
  "description": "(Ab)Sturz - allgemeine Hilfe (keine Verletzung) Suizid"
}
```

Please note, that at the moment all results are returned in german. Translations are planned for the future.

# Contributing

If you see another code in the wild please open an issue on github.

To contribute to the software fork and create a pull request.

# Roadmap

1. A lot more codes
2. Translations?
