namespace SpriteKind {
    export const Ball = SpriteKind.create();
}
let bouncers: Sprite[] = []
let balls: Image[] = []
let catcher: Sprite = null
let deadball: Sprite = null
let sitting = 0
let playing = false
game.splash("Bouncer Bucket", "A = 1 ball, B = 10 balls")
balls.push(img`
. . 7 7 7 7 . .
. 7 7 7 7 7 7 .
7 7 7 7 7 7 7 7
7 7 7 7 7 7 7 7
7 7 7 7 7 7 7 7
7 7 7 7 7 7 7 7
. 7 7 7 7 7 7 .
. . 7 7 7 7 . .
`)
balls.push(img`
. . 2 2 2 2 . .
. 2 2 2 2 2 2 .
2 2 2 2 2 2 2 2
2 2 2 2 2 2 2 2
2 2 2 2 2 2 2 2
2 2 2 2 2 2 2 2
. 2 2 2 2 2 2 .
. . 2 2 2 2 . .
`)
balls.push(img`
. . 4 4 4 4 . .
. 4 4 4 4 4 4 .
4 4 4 4 4 4 4 4
4 4 4 4 4 4 4 4
4 4 4 4 4 4 4 4
4 4 4 4 4 4 4 4
. 4 4 4 4 4 4 .
. . 4 4 4 4 . .
`)
catcher = sprites.create(img`
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
1 . . . . . . . . . . . . . . 1
f e e . . . . . . . . . . e e f
1 f e e . . . . . . . . e e f 1
1 1 f e e e e e e e e e e f 1 1
. 1 e f e e e e e e e e f e 1 .
. 1 e f e e e e e e e e f e 1 .
. 1 e e f f e e e e f f e e 1 .
. 1 e e e e f f f f e e e e 1 .
. 1 1 e e e e e e e e e e 1 1 .
. . 1 e e e e e e e e e e 1 . .
. . 1 e e e e e e e e e e 1 . .
. . 1 1 e e e e e e e e 1 1 . .
. . . 1 e e e e e e e e 1 . . .
. . . 1 1 1 1 1 1 1 1 1 1 . . .
`, SpriteKind.Player)
catcher.bottom = scene.screenHeight() - 1
catcher.setStayInScreen(true)
info.setScore(0)
sprites.onOverlap(SpriteKind.Ball, SpriteKind.Player, function (sprite, otherSprite) {
    if (sprite.x > otherSprite.x - 2 && sprite.x < otherSprite.x + 2) {
        if (sitting > 300) {
            otherSprite.say("nope", 200)
            sprite.vy = sprite.vy * -2
        } else {
            let normalScore = sprite.vx
            if (normalScore < 0) {
                normalScore = normalScore * -1
            }
            otherSprite.say("" + normalScore, 200)
            info.setScore(info.score() + normalScore)
            sprite.destroy()
        }
    } else if (sprite.x <= otherSprite.x) {
        sprite.vx = sprite.vx * -2
    } else {
        sprite.vx = sprite.vx * 2
    }
})
info.onCountdownEnd(function () {
    playing = false
    game.over(false)
})
sprites.onDestroyed(SpriteKind.Ball, function (sprite) {
    for (let j = 0; j <= bouncers.length - 1; j++) {
        if (bouncers[j] == sprite) {
            deadball = bouncers.removeAt(j)
        }
    }
    makeBouncer()
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!playing) {
        playing = true
        makeBouncer()
        info.startCountdown(60)
    }
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!playing) {
        playing = true
        for (let i = 0; i < 10; i++) {
            makeBouncer()
        }
        info.startCountdown(30)
    }
})
function makeBouncer() {
    let ballChoice = randint(0, 2)
    let ballsCount = bouncers.unshift(sprites.create(balls[ballChoice], SpriteKind.Ball))
    bouncers[0].setFlag(SpriteFlag.AutoDestroy, true)
    bouncers[0].x = randint(0, scene.screenWidth() / 4)
    bouncers[0].y = randint(0, scene.screenHeight() / 3)
    bouncers[0].vx = 10 + ballChoice * 10
    bouncers[0].ay = 100
}
game.onUpdate(function () {
    let moveX = controller.dx()
    if (moveX != 0) {
        sitting = 0
        catcher.x += moveX
    }
})
game.onUpdateInterval(10, function () {
    for (let bouncer of bouncers) {
        if (bouncer.bottom >= scene.screenHeight() && bouncer.vy > 0) {
            bouncer.vy = bouncer.vy * -1
            bouncer.ay = bouncer.ay + 20
        }
    }
    sitting += 1
})