var tips:Array<string> = [
    'welcome, to jz🅱️uilder2',
    'extruding is fun! try it out with the E key!',
    // 'you can delete stuff with ctrl-backspace! mac CMD key isn\'t supported yet, for silly reasons',
    'wow! this tool is a lot of fun, huh?',
    'i hope you\'re doing ok! remember to reach out to friends you haven\'t caught up with in a while. they\'ll probably be very happy to hear from you!',
    'hiya!',
    ':)',
    'your map is looking great so far! keep it up!',
    'you\'re super great, i\'m so glad you\'re hanging out with me :)',
    'i hope you\'re having fun!',
    'you can use the space key to pan around the map!'
]

function newTip() {
    let el = document.getElementById("petext");
    el.innerHTML = tips[Math.floor(Math.random()*tips.length)];
}