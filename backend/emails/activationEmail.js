const activationEmailTemplate = function (firstName, link) {

    let html =
    `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
    </head>
    
    <body style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;">
        <div style="width: 100%; background: #dddddd; padding-top: 20px;">
            <div style="width: 100%; max-width: 600px; background: #ffffff; margin: 0 auto 0 auto; padding: 20px;">
                <h1>Kedves ${firstName}!</h1>
                <p>Köszönjük, hogy regisztráltál.</p>
    
                <p>Kérjük, aktiváld az email címedet az alábbi linkre való kattintással: <a href="${link}">aktivalo link</a></p>
                <p>Válaszolj pár kérdésünkre és tudd meg, hogyan tehetsz többet a környezetedért!
                Ráadásul most még nyerhetsz is vele.</p>
    
                <h2>Sok sikert kívánunk!</h2>
                Környezetre Fel! Csapata
    
            </div>
            <div style="width: 100%; max-width: 600px; background: #dddddd; margin: 0 auto 0 auto; padding: 20px;">
    
                <a href="#" style="text-decoration: none; color: #555555">Adatvédelmi kezelés</a>
            </div>
        </div>
    </body>
    
    </html>`

    return html
}

module.exports = activationEmailTemplate
