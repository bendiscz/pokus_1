interface Position { x: number, y: number }

let headSprite: Sprite
let headPosition: Position
let direction: String

let bodySprites: Sprite[]
let bodyLength: number

let appleSprite: Sprite

let speed = 200
let lastMove = game.runtime()

const step = 8

function start() {
    headPosition = {x: 80, y: 64}
    bodyLength = 3
    bodySprites = []
    direction = "right"

    headSprite = sprites.create(assets.image`snake_head`, SpriteKind.Player)
    headSprite.z = 100
    headSprite.setPosition(headPosition.x, headPosition.y)

    appleSprite = sprites.create(assets.image`apple`, SpriteKind.Food)
    appleSprite.setPosition(48, 16)

    // game.onUpdateInterval(250, move)
    game.onUpdate(update)

    controller.left.onEvent(ControllerButtonEvent.Pressed, function() {
        direction = "left"
    })
    controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
        direction = "right"
    })
    controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
        direction = "up"
    })
    controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
        direction = "down"
    })

    controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
        bodyLength++
    })

    controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
        speed -= 10
    })

    sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite: Sprite, otherSprite: Sprite) {
        game.over(false)
    })
    sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite: Sprite, otherSprite: Sprite) {
        eat()
    })
}

function update() {
    if (game.runtime() - speed >= lastMove) {
        lastMove = game.runtime() + speed
        move()
    }
}

function move() {
    let bodySprite = sprites.create(assets.image`snake_body`, SpriteKind.Enemy)
    bodySprite.setPosition(headPosition.x, headPosition.y)

    bodySprites.push(bodySprite)
    if (bodySprites.length > bodyLength) {
        let lastBodySprite = bodySprites.shift()
        lastBodySprite.destroy()
    }

    // 19 x 14

    if (direction == "right") {
        headPosition.x += 8
        if (headPosition.x > 160) {
            headPosition.x -= 160
        }
    } else if (direction == "left") {
        headPosition.x -= 8
        if (headPosition.x < 0) {
            headPosition.x += 160
        }
    } else if (direction == "down") {
        headPosition.y += 8
        if (headPosition.y > 128) {
            headPosition.y -= 128
        }
    } else if (direction == "up") {
        headPosition.y -= 8
        if (headPosition.y < 0) {
            headPosition.y += 128
        }
    }

    headSprite.setPosition(headPosition.x, headPosition.y)
}

function eat() {
    bodyLength += 1
    let free = []
    for (let x = 0; x < 19; x++) {
        for (let y = 0; y < 14; y++) {
            let p = { x: x * step, y: y * step }
            if (headPosition.x != p.x && headPosition.y != p.y && bodySprites.every(e => e.x != p.x || e.y != p.y)) {
                free.push(p)
            }
        }
    }

    let applePosition = free[randint(0, free.length-1)]
    appleSprite.setPosition(applePosition.x, applePosition.y)
}

start()
