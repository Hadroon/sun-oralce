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
    
    <body style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif; color: #222;">
        <div style="width: 100%; background: #dddddd; padding-top: 20px;">
            <div style="width: 100%; max-width: 600px; background: #ffffff; margin: 0 auto 0 auto; padding: 20px;">
                <h1 style="color: #0079c1;">Kedves ${firstName}!</h1>
    
                <p>A linkre való kattintással meg tudod változtatni jelszavad: <a style="text-decoration: none; color: #0079c1; font-weight: bold;" href="${link}">jelszó cseréje</a></p>
    
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
