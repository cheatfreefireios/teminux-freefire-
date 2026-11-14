const CONFIG = {
    getKeyUrl: "https://bbmkts.com/ql?token=e3ed5e88fefd828697e1c0db&longurl=https://thinhkk999.github.io/getkey/",
    validKeys: ["TDZ-VIP-2026", "TERMUX-FREE-999", "THINH999"],
    keyPrefix: "TDZ-",
    expireHours: 24
};

// Kiểm tra xem đã đăng nhập từ trước chưa
window.onload = function() {
    const savedAuth = localStorage.getItem("termux_auth_time");
    if (savedAuth && (Date.now() - parseInt(savedAuth) < CONFIG.expireHours * 3600000)) {
        unlockTerminal();
    }
};

// Xử lý nút Get Key (Fix chống chặn chuyển hướng trên mobile)
document.getElementById("btn-get").addEventListener("click", function() {
    const statusEl = document.getElementById("key-status");
    statusEl.style.color = "#eab308";
    statusEl.innerText = "[*] Đang chuyển hướng sang trang lấy Key...";
    
    const a = document.createElement('a');
    a.href = CONFIG.getKeyUrl;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

// Xử lý xác thực Key
function verifyKey() {
    const inputVal = document.getElementById("key-input").value.trim();
    const statusEl = document.getElementById("key-status");

    if (!inputVal) {
        statusEl.style.color = "#ef4444";
        statusEl.innerText = "[!] Vui lòng nhập Key trước khi truy cập.";
        return;
    }

    if (CONFIG.validKeys.includes(inputVal) || (CONFIG.keyPrefix && inputVal.startsWith(CONFIG.keyPrefix))) {
        statusEl.style.color = "#22c55e";
        statusEl.innerText = "[✓] Key hợp lệ! Đang khởi động Terminal...";
        localStorage.setItem("termux_auth_time", Date.now().toString());
        setTimeout(() => {
            unlockTerminal();
        }, 600);
    } else {
        statusEl.style.color = "#ef4444";
        statusEl.innerText = "[X] Key không chính xác hoặc đã hết hạn!";
    }
}

document.getElementById("btn-verify").addEventListener("click", verifyKey);
document.getElementById("key-input").addEventListener("keydown", function(e) {
    if (e.key === "Enter") verifyKey();
});

function unlockTerminal() {
    document.getElementById("key-gate").style.display = "none";
    document.getElementById("terminal-app").style.display = "flex";
    document.getElementById("cmd-input").focus();
}

function logoutKey() {
    localStorage.removeItem("termux_auth_time");
    location.reload();
}

// Xử lý lệnh trong Terminal
const cmdInput = document.getElementById("cmd-input");
const termOutput = document.getElementById("terminal-output");

cmdInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        const cmd = this.value.trim();
        if (cmd) {
            runCommand(cmd);
            this.value = "";
        }
    }
});

function printLog(text, className = "log-sys") {
    const div = document.createElement("div");
    div.className = `log-line ${className}`;
    div.innerText = text;
    termOutput.appendChild(div);
    termOutput.scrollTop = termOutput.scrollHeight;
}

function runCommand(rawCmd) {
    printLog(`$ ${rawCmd}`, "log-red");
    const cmd = rawCmd.toLowerCase();

    if (cmd === "help") {
        printLog("--- DANH SÁCH LỆNH HỖ TRỢ ---", "log-warn");
        printLog("• aimbot on / off   : Bật/tắt giả lập hỗ trợ ghìm tâm");
        printLog("• headshot [1-100]  : Thiết lập tỉ lệ kéo tâm");
        printLog("• bypass            : Kích hoạt chống quét hệ thống");
        printLog("• clear             : Xóa màn hình terminal");
        printLog("• logout            : Đăng xuất khỏi phiên Key");
    } else if (cmd === "aimbot on") {
        printLog("[*] Đang nạp module lib_aim_assist.so...", "log-sys");
        setTimeout(() => printLog("[✓] AIMBOT LOCK: ENABLED (FOV: 120)", "log-ok"), 400);
    } else if (cmd === "aimbot off") {
        printLog("[!] Đã tắt module Aimbot.", "log-warn");
    } else if (cmd.startsWith("headshot")) {
        const val = cmd.split(" ")[1] || "90";
        printLog(`[*] Đang hiệu chỉnh độ nhạy trục Y -> ${val}%...`, "log-sys");
        setTimeout(() => printLog(`[✓] Đã áp dụng cấu hình Headshot ${val}%`, "log-ok"), 350);
    } else if (cmd === "bypass") {
        printLog("[*] Đang ẩn tiến trình & giả lập chữ ký...", "log-sys");
        setTimeout(() => printLog("[✓] ANTI-BAN BYPASS: ACTIVE (SAFE)", "log-ok"), 600);
    } else if (cmd === "clear") {
        termOutput.innerHTML = "";
    } else if (cmd === "logout") {
        logoutKey();
    } else {
        printLog(`sh: ${rawCmd}: không tìm thấy lệnh. Gõ 'help' để xem hướng dẫn.`, "log-warn");
    }
}
