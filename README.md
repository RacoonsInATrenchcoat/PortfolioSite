# PortfolioSite
Main website for Portfolio

Reminders: 
- use "tree /F > structure.txt" to save structure.
- "firebase functions:config:get" to check currently setup config.
- If the refresh token breaks for some reason, goto OAuth Playground to re-generate and use "firebase functions:config:set gmail.refresh_token="NEW_REFRESH_TOKEN"
- Firebase SDK is not added yet, as no DB or any bonus functionality are used. 
- By default, Email address that is the target must be the same as the account that generated the tokens.
- Using Gen1 Google Could Functions. 2 is standard today but requires more work and not needed.

Reformatted to use "kebab-case" as a standard.

Checklist to ensure standards:
https://frontendchecklist.io

Used 3rd parties:
 - Google Cloud + Google Secrets + Functions (emailing)
 - Firebase Hosting + Functions

Limits:
Google cloud:
Invocations: 2 million per month - logic and handling of emails sent. assumed 1 per mail.
Compute Time: 400,000 GB-seconds per month
Outbound Networking: 5 GB per month  - emails sent. assumed max 50kb per mail.

Firestore:
Stored Data: 1 GiB
Document Reads: 50,000 per day
Document Writes: 20,000 per day - emails sent. assumed 1 per mail.
Document Deletes: 20,000 per day
Outbound Data Transfer: 10 GiB per month - site loading. Assumed 100~ mb per load.


Attributes and sources:

Space wallpaper: https://opengameart.org/content/seamless-space-backgrounds
Icons:  https://www.svgrepo.com
        https://icons8.com/icon/jShwZ2RCyPSO/phone
        https://www.flaticon.com/free-icon/astronaut-ingravity_80643
        HTML: https://www.flaticon.com/free-icon/html-5_5968267?term=html+5&page=1&position=2&origin=tag&related_id=5968267
        CSS: https://www.flaticon.com/free-icon/css-3_5968242?term=css&page=1&position=3&origin=search&related_id=5968242
        JS: https://www.flaticon.com/free-icon/js_5968292?term=javascript&page=1&position=3&origin=search&related_id=5968292
        React: https://www.flaticon.com/free-icon/sciene_11305826?term=react&page=1&position=14&origin=search&related_id=11305826
        Github: https://github.com/logos
        Figma: https://www.flaticon.com/free-icon/figma_5968705?term=figma&page=1&position=2&origin=search&related_id=5968705
        API: https://www.flaticon.com/free-icon/api_8297437?term=api&page=1&position=4&origin=search&related_id=8297437
        NPM: https://www.flaticon.com/free-icon/programing_15484297?term=npm&page=1&position=2&origin=search&related_id=15484297
        Interactive: https://www.flaticon.com/free-icon/interaction_1589513
        Metadata: https://www.flaticon.com/free-icon/metadata_3344335?k=1747390692422&sign-up=google
Logo:   https://www.flaticon.com/free-icon/circle_11068138


Desktop:
    W: 1920
    H: 1080

Header:
    W: 1920
    H: 60

Body:
    W: 1920
    H: ~2120 (to stretch)

    Sidelines:
        W: 50
        H: ~2120 (to stretch)


    HeaderText:
        W: 1820
        H: 100

    Title+Image
        -> Left: W: 1420 H: 100
        -> Right: W: 400 H: 100

    BigText Only
        W: 1820
        H: 200

    SecondaryText +Image
        W: 1820
        H: 200

        -> Left: W: 200 H: 200
        -> Right: W: 1620 H: 200

Footer:
    W: 1920
    H: 100
