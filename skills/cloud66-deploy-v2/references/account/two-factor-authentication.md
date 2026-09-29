# Enabling two-factor authentication (2FA)


## What is two-factor authentication?

Two-factor authentication (2FA) requires a second set of credentials, in addition to a password and username, before it will allow access to an account. 

You can read more about the concept in [our Security Score guide](../security/understanding-and-improving-security-score.md#why-do-i-need-2fa).

## Enabling 2FA on your account

To enable two-factor authentication on your Cloud 66 account: 

1. Open your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on your account avatar (top-right) and select *Account Settings*
3. Click on *Login & Security* in the **Account** panel on the left (if you don't see this option,  You can switch organisations using the dropdown at the top right of the screen. You need to be in your default organisation in order to change security settings. ) 
4. Click on the *Two-factor Authentication* tab
5. Install an authenticator app on your phone (links are provided), or open 1Password and then click the green *Next - Scan barcode and verify*  button
6. Scan the barcode provided using your newly installed authenticator app, or [using 1Password](https://support.1password.com/one-time-passwords/). You can also manually enter the details of the key if you're having trouble scanning the barcode.
7. Enter the verification code provided by your chosen authenticator and click the *Verify* button

## Logging in with 2FA

If 2FA is enabled, when you log in you will be asked to provide the current confirmation code from your authenticator app. This code changes constantly (every minute or so), so it will be different every time you log in. 

If you use the same computer and browser you will not be asked every time you log in, but we will ask periodically or if anything about your computer changes (such as the network you're using).

## Enforcing 2FA for your team

You can also force all the members of your Cloud 66 account to use 2FA. To do this:

1. Open your [Dashboard](https://app.cloud66.com/dashboard)
2. Click on your account avatar (top-right) and select *Account Settings*
3. Click on *Login & Security* in the **Account** panel on the left
4. Scroll down to the section named "Enforce 2FA for your Team" and click the green *Force 2FA for your_team_name* button.

This will oblige all team members to set up 2FA before they are able to access the team's Cloud 66 account.

## Account Protection Level

The Account Protection Level setting determines how strict your account should be about confirming your login via 2FA. We use risk heuristics to determine whether to challenge a login attempt, and this setting adjusts how sensitive your account is to those heuristics. 

The levels are:

- **Relax** - significantly reduces the frequency of 2FA challenges
- **Normal** - the default state, requires 2FA when it detects elevated risk
- **Strict** - checks 2FA whenever you log in

These settings are account wide, and will apply to all members of teams under an account (exactly as it does for 2FA itself). If you don’t have 2FA enabled then this setting won’t do anything.

## Adding a physical FIDO2 security key

Physical security keys add another layer of security to your account, making it even harder for anyone to gain unauthorised access. 

There are a numbers of options available for physical keys:

- USB-based keys such as the **[YubiKey](https://www.yubico.com/)**
- Bluetooth-based keys (including wearables)
- NFC-based keys (including many smartphones)
- Mac devices that have fingerprint sensors (”Touch ID”) can be used as keys
- Android devices with biometric sensors can be used as keys (beta)
- Users of Windows Hello should be able to use their biometrics as keys (beta)

If you need more background info on how physical keys work please read our [guide](../security/understanding-and-improving-security-score.md#fido-authentication) on the subject.

To add a physical key:

1. Open your **[Dashboard](https://app.cloud66.com/dashboard)**
2. Click on your account avatar (top-right) and select *Account Settings*
3. Click on *Login & Security* in the **Account** panel on the left
4. Click on the *Security Keys* tab
5. Click the *+ Add Security Key* buttom
6. Follow the instructions on screen to pair your physical device to your Cloud 66 account

### Using Mac Touch ID as a physical key

Mac devices which have fingerprint sensors (”Touch ID”) can be used as keys in the latest versions of Chrome, Safari and Edge. The process for adding Touch ID as a key differs slightly between browsers:

**For Chrome and Edge:**

1. Click add *+ Add Security Key*
2. Select “*This device*” in the browser options panel that pops up 
3. Authenticate with your fingerprint to confirm the request.

**For Safari:**

1. Click add *+ Add Security Key*
2. Then click the *Add my Security Key* button
3. A browser pop up will appear asking if you want to allow "app.cloud66.com" to use your Touch ID. Authenticate with your fingerprint to confirm the request.

## Troubleshooting

### If you're using a USB-based device:

- Ensure you've read the installation and usage instructions from the manufacturer
- Ensure that your computer recognises and is able to read the device (including that it is properly inserted into a compatible port)
- Work through this [troubleshooting guide](https://support.yubico.com/hc/en-us/articles/360013707540-Basic-YubiKey-Troubleshooting) from Yubikey (many of these issues are common to other USB devices)