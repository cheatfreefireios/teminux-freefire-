import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBbakrOVPpA2gEtVAJJ--yxZi8N7iGg8R0",
    authDomain: "dung-online.firebaseapp.com",
    databaseURL: "https://sharehub-feee9-default-rtdb.firebaseio.com",
    projectId: "dung-online",
    storageBucket: "dung-online.firebasestorage.app",
    messagingSenderId: "544119334753",
    appId: "1:544119334753:web:813f1ec13c4415e841c720",
    measurementId: "G-M40B1EE5FV"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const output = document.getElementById('output');
const input = document.getElementById('cmdInput');
const avatarTrigger = document.getElementById('avatarTrigger');
const adminAuthModal = document.getElementById('adminAuthModal');
const adminPanelModal = document.getElementById('adminPanelModal');
const loginBtn = document.getElementById('loginBtn');
const cancelLoginBtn = document.getElementById('cancelLoginBtn');
const closeAdminBtn = document.getElementById('closeAdminBtn');
const saveCodeBtn = document.getElementById('saveCodeBtn');
const adminUser = document.getElementById('adminUser');
const adminPass = document.getElementById('adminPass');
const authError = document.getElementById('authError');
const newCodeInput = document.getElementById('newCodeInput');
const adminActionMsg = document.getElementById('adminActionMsg');
const rootverModal = document.getElementById('rootverModal');
const inputUserCode = document.getElementById('inputUserCode');
const submitUserCodeBtn = document.getElementById('submitUserCodeBtn');
const getKeyBtn = document.getElementById('getKeyBtn');
const rootverMsg = document.getElementById('rootverMsg');

let isProcessing = false;

// Chuyển hướng sang trang vượt link / lấy key
getKeyBtn.addEventListener('click', () => {
    window.location.href = "https://bbmkts.com/go/Zi8yl";
});

// Kiểm tra mã key người dùng nhập từ Firebase
submitUserCodeBtn.addEventListener('click', async () => {
    const code = inputUserCode.value.trim();
    if (!code) {
        rootverMsg.style.color = '#ff3333';
        rootverMsg.innerText = 'Vui lòng nhập mã!';
        return;
    }

    rootverMsg.style.color = '#ffaa33';
    rootverMsg.innerText = 'Đang kiểm tra máy chủ...';

    try {
        const snapshot = await get(child(ref(db), 'rootver_codes/' + code));
        if (snapshot.exists()) {
            rootverMsg.style.color = '#33ff77';
            rootverMsg.innerText = 'Xác thực thành công! Đang vào menu...';
            setTimeout(() => {
                rootverModal.style.display = 'none';
                input.focus();
            }, 800);
        } else {
            rootverMsg.style.color = '#ff3333';
            rootverMsg.innerText = 'Mã không tồn tại hoặc sai!';
        }
    } catch (error) {
        rootverMsg.style.color = '#ff3333';
        rootverMsg.innerText = 'Lỗi kết nối máy chủ!';
    }
});

// Giữ avatar 3s để mở Admin
let holdTimer;
['mousedown', 'touchstart'].forEach(evt => {
    avatarTrigger.addEventListener(evt, () => {
        holdTimer = setTimeout(() => {
            adminAuthModal.style.display = 'flex';
            adminUser.value = '';
            adminPass.value = '';
            authError.innerText = '';
        }, 3000);
    });
});
['mouseup', 'touchend'].forEach(evt => {
    avatarTrigger.addEventListener(evt, () => clearTimeout(holdTimer));
});

loginBtn.addEventListener('click', () => {
    if (adminUser.value.trim() === 'TDZADMIN' && adminPass.value.trim() === 'TDZ2013@') {
        adminAuthModal.style.display = 'none';
        adminPanelModal.style.display = 'flex';
        adminActionMsg.innerText = '';
    } else {
        authError.innerText = 'Sai tài khoản hoặc mật khẩu!';
    }
});

cancelLoginBtn.addEventListener('click', () => { adminAuthModal.style.display = 'none'; });
closeAdminBtn.addEventListener('click', () => { adminPanelModal.style.display = 'none'; });

saveCodeBtn.addEventListener('click', async () => {
    const code = newCodeInput.value.trim();
    if (!code) {
        adminActionMsg.style.color = '#ff3333';
        adminActionMsg.innerText = 'Vui lòng nhập mã cần tạo!';
        return;
    }

    adminActionMsg.style.color = '#ffaa33';
    adminActionMsg.innerText = 'Đang lưu mã lên máy chủ...';

    try {
        await set(ref(db, 'rootver_codes/' + code), {
            created_at: new Date().toISOString(),
            status: 'active'
        });
        adminActionMsg.style.color = '#33ff77';
        adminActionMsg.innerText = `Đã lưu mã [${code}] thành công!`;
        newCodeInput.value = '';
    } catch (error) {
        adminActionMsg.style.color = '#ff3333';
        adminActionMsg.innerText = 'Lỗi: ' + error.message;
    }
});

const commands = {
    'help': `
<div class="help-box">
    <div class="line system" style="margin-bottom: 6px; border-bottom: 1px solid var(--text-muted); padding-bottom: 4px;">DANH SÁCH LỆNH HỆ THỐNG VIP:</div>
    <div class="help-row"><span class="help-cmd">help</span><span class="help-desc">: Xem bảng danh sách lệnh</span></div>
    <div class="help-row"><span class="help-cmd">clear</span><span class="help-desc">: Làm sạch màn hình terminal</span></div>
    <div class="help-row"><span class="help-cmd">scan</span><span class="help-desc">: Quét bộ nhớ RAM & tiến trình game</span></div>
    <div class="help-row"><span class="help-cmd">inject</span><span class="help-desc">: Chạy nạp payload vào trò chơi</span></div>
    <div class="help-row"><span class="help-cmd">aimbot</span><span class="help-desc">: Bật tính năng khóa mục tiêu</span></div>
    <div class="help-row"><span class="help-cmd">headshot</span><span class="help-desc">: Đẩy tỉ lệ trúng đầu tối đa</span></div>
    <div class="help-row"><span class="help-cmd">antenna</span><span class="help-desc">: Hiển thị đường sóng định vị ESP</span></div>
    <div class="help-row"><span class="help-cmd">bypass</span><span class="help-desc">: Kích hoạt lớp chống khóa hệ thống</span></div>
    <div class="help-row"><span class="help-cmd">rootver</span><span class="help-desc">: Kiểm tra trạng thái ROOT thiết bị</span></div>
    <div class="help-row"><span class="help-cmd">status</span><span class="help-desc">: Kiểm tra kết nối & bản quyền</span></div>
</div>`,
    'status': `
<span class="line info">[SYSTEM STATUS]</span>
  - Security Guard : <span class="line success">BYPASSED</span>
  - Memory Offset  : <span class="line success">READY (0x7F)</span>
  - Latency        : <span class="line info">12ms</span>
  - License Status : <span class="line success">VIP LIFETIME</span>`
};

input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const cmd = input.value.trim().toLowerCase();
        if (cmd === '' || isProcessing) return;

        printLine(`<span class="prompt">root@terminux:~#</span> <span class="line cmd">${escapeHtml(input.value)}</span>`);
        input.value = '';
        handleCommand(cmd);
    }
});

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function printLine(htmlText) {
    const div = document.createElement('div');
    div.className = 'line';
    div.innerHTML = htmlText;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
}

function handleCommand(cmd) {
    if (cmd === 'clear') {
        output.innerHTML = '';
        return;
    }

    if (commands[cmd]) {
        printLine(commands[cmd]);
        return;
    }

    switch(cmd) {
        case 'scan':
            runScanSequence();
            break;
        case 'inject':
            runInjectSequence();
            break;
        case 'aimbot':
            runToggleScript('AIMBOT LOCK 100%', '0x7FFF90A1');
            break;
        case 'headshot':
            runToggleScript('HEADSHOT RATE 99.9%', '0x8A00F210');
            break;
        case 'antenna':
            runToggleScript('ESP ANTENNA LOCATION', '0x12FF08B4');
            break;
        case 'bypass':
            runBypassSequence();
            break;
        case 'rootver':
            printLine(`<span class="line info">[+] Trạng thái ROOTVER: Đã xác thực thành công (Active).</span>`);
            break;
        default:
            printLine(`<span class="line dim">bash: ${escapeHtml(cmd)}: command not found. Gõ 'help' để xem danh sách lệnh.</span>`);
    }
}

function runToggleScript(name, memAddr) {
    isProcessing = true;
    printLine(`<span class="line info">[+] Đang kích hoạt: ${name}...</span>`);
    setTimeout(() => { printLine(`<span class="line dim">[>] Ghi đè địa chỉ bộ nhớ ${memAddr}...</span>`); }, 350);
    setTimeout(() => {
        printLine(`<span class="line success">[✓] THÀNH CÔNG: ${name} [ACTIVE]</span>`);
        isProcessing = false;
    }, 800);
}

function runScanSequence() {
    isProcessing = true;
    printLine(`<span class="line info">[+] Đang quét tiến trình hệ thống...</span>`);
    const steps = [
        `[1/3] Quét PID tiến trình... <span class="line success">FOUND (PID: 8841)</span>`,
        `[2/3] Đọc offset Framework... <span class="line success">OK</span>`,
        `[3/3] Đã phát hiện 50 mục tiêu trong phạm vi!`
    ];
    steps.forEach((step, index) => {
        setTimeout(() => {
            printLine(`<span class="line dim">${step}</span>`);
            if (index === steps.length - 1) isProcessing = false;
        }, (index + 1) * 450);
    });
}

function runBypassSequence() {
    isProcessing = true;
    printLine(`<span class="line info">[+] Đang bypass cơ chế Anti-Cheat...</span>`);
    setTimeout(() => printLine(`<span class="line dim">[>] Xóa logs hệ thống...</span>`), 300);
    setTimeout(() => printLine(`<span class="line dim">[>] Chặn gói tin gởi về Server...</span>`), 700);
    setTimeout(() => {
        printLine(`<span class="line success">[✓] ANTI-BAN ACTIVATED - SAFE 100%</span>`);
        isProcessing = false;
    }, 1200);
}

function runInjectSequence() {
    isProcessing = true;
    printLine(`<span class="line info">[+] Đang inject Payload...</span>`);
    const progressDiv = document.createElement('div');
    progressDiv.className = 'progress-box';
    output.appendChild(progressDiv);

    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        const blocks = '█'.repeat(progress / 10);
        const spaces = ' '.repeat(10 - (progress / 10));
        progressDiv.innerHTML = `<span class="line info">Injecting: [${blocks}${spaces}] ${progress}%</span>`;
        output.scrollTop = output.scrollHeight;

        if (progress >= 100) {
            clearInterval(interval);
            printLine(`<span class="line success">[✓] INJECT SUCCESSFUL! VIP MENU đã sẵn sàng.</span>`);
            isProcessing = false;
        }
    }, 120);
}
