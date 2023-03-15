function pmHelp() {
    console.info(`操作指南：
    - 输入地图行列数，初始化地图；
    - 单击块切换块状态以设计地图；
    - 当地图中有且只有一个玩家时，可以使用WASD来操纵。`);
}

var r, c;
const pi = "😋";

function init(ri, ci) {
    if (ri && ci)
        r = ri, c = ci;
    else
        r = parseInt(document.querySelector("#r").value),
            c = parseInt(document.querySelector("#c").value);
    var cas = document.querySelector("#map");
    cas.style.cssText +=
        "--r: " + r + "; --c: " + c + ";";
    cas.innerHTML = "";
    let i = 1, j = 1;
    const iid = setInterval(function () {
        if (j > c)
            i++, j = 1;
        if (i > r) {
            clearInterval(iid);
            return;
        }
        cas.innerHTML += `
            <div class="brick" x="`+ j++ + `" y="` + i + `" state="air" underfoot=""></div>
        `;
    }, 1000 / r / c);
    setTimeout(function () {
        Array.from(document.getElementsByClassName("brick")).forEach(b => {
            b.onclick = function () {
                setBlock(b);
            }
        });
    }, 1000);
    return true;
}

function setBlock(b) {
    switch (b.getAttribute("state")) {
        case "air":
            b.style.cssText += "background: #888";
            b.setAttribute("state", "rock");
            break;
        case "rock":
            b.style.cssText += "background: linear-gradient(to bottom right, #fff, #ddd)";
            b.innerText = "X";
            b.setAttribute("state", "target");
            break;
        case "target":
            b.innerText = "📦";
            b.setAttribute("state", "box");
            break;
        case "box":
            b.innerText = pi;
            b.setAttribute("state", "player");
            break;
        case "player":
            b.innerText = "";
            b.setAttribute("state", "air");
            break;
    }
}

window.onkeyup = function (e) {
    if (e.keyCode != 87 && e.keyCode != 65 && e.keyCode != 83 && e.keyCode != 68)
        return;
    let player;
    Array.from(document.getElementsByClassName("brick")).forEach(b => {
        if (b.getAttribute("state") == "player")
            player = b;
    });
    if (!player) {
        alert("没有玩家可供操纵！");
        return;
    }
    function getBlock(x, y) {
        let block;
        Array.from(document.getElementsByClassName("brick")).forEach(b => {
            if (b.getAttribute("x") == new String(x) &&
                b.getAttribute("y") == new String(y))
                block = b;
        });
        return block;
    }
    const playerX = parseInt(player.getAttribute("x"));
    const playerY = parseInt(player.getAttribute("y"));
    var nextBlockX = playerX, nextBlockY = playerY;
    switch (e.keyCode) {
        case 87: // W
            nextBlockY--;
            break;
        case 65: // A
            nextBlockX--;
            break;
        case 83: // S
            nextBlockY++;
            break;
        case 68: // D
            nextBlockX++;
            break;
    }
    let ob = getBlock(playerX, playerY);
    let nb = getBlock(nextBlockX, nextBlockY);
    switch (nb.getAttribute("state")) {
        case "air":
            nb.innerText = pi;
            nb.setAttribute("state", "player");
            if (!ob.getAttribute("underfoot")) {
                ob.innerText = "";
                ob.setAttribute("state", "air");
            } else {
                ob.innerText = "X";
                ob.setAttribute("state", "target");
                ob.getAttribute("underfoot") = "";
            }
            break;
        case "rock":
            break;
        case "target":
            nb.innerText = pi;
            nb.setAttribute("state", "player");
            nb.setAttribute("underfoot", "target");
            if (!ob.getAttribute("underfoot")) {
                ob.innerText = "";
                ob.setAttribute("state", "air");
            } else {
                ob.innerText = "X";
                ob.setAttribute("state", "target");
                ob.getAttribute("underfoot") = "";
            }
            break;
        case "box":
            let box = nb;
            let boxNextBlock = getBlock(2 * nextBlockX - playerX, 2 * nextBlockY - playerY);
            switch (boxNextBlock.getAttribute("state")) {
                case "air":
                    boxNextBlock.innerText = "📦";
                    boxNextBlock.setAttribute("state", "box");
                    box.innerText = pi;
                    box.setAttribute("state", "player");
                    if (!ob.getAttribute("underfoot")) {
                        ob.innerText = "";
                        ob.setAttribute("state", "air");
                    } else {
                        ob.innerText = "X";
                        ob.setAttribute("state", "target");
                        ob.getAttribute("underfoot") = "";
                    }
                    break;
                case "rock":
                    break;
                case "target":
                    boxNextBlock.innerText = "📦";
                    boxNextBlock.setAttribute("state", "box");
                    boxNextBlock.setAttribute("underfoot", "target");
                    box.innerText = pi;
                    box.setAttribute("state", "player");
                    if (!ob.getAttribute("underfoot")) {
                        ob.innerText = "";
                        ob.setAttribute("state", "air");
                    } else {
                        ob.innerText = "X";
                        ob.setAttribute("state", "target");
                        ob.getAttribute("underfoot") = "";
                    }
                    break;
                case "box":
                    break;
            }
            break;
    }
}