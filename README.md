# PortfolioSite
Main website for Portfolio

Reminders: 
- use "tree /F > structure.txt" to save structure.
- "firebase functions:config:get" to check currently setup config.
- If the refresh token breaks for some reason, goto OAuth Playground to re-generate and use "firebase functions:config:set gmail.refresh_token="NEW_REFRESH_TOKEN"
- Firebase SDK is not added yet, as no DB or any bonus functionality are used. 
- By default, Email address that is the target must be the same as the account that generated the tokens.
- Using Gen1 Google Could Functions. 2 is standard today but requires more work and not needed.

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
