const output = document.getElementById('output');
const input = document.getElementById('cmdInput');
const noticeModal = document.getElementById('noticeModal');
const readBtn = document.getElementById('readBtn');

const avatarTrigger = document.getElementById('avatarTrigger');
const adminAuthModal = document.getElementById('adminAuthModal');
const adminPanelModal = document.getElementById('adminPanelModal');
const loginBtn = document.getElementById('loginBtn');
const cancelLoginBtn = document.getElementById('cancelLoginBtn');
const closeAdminBtn = document.getElementById('closeAdminBtn');
const activateCodeBtn = document.getElementById('activateCodeBtn');
const adminUser = document.getElementById('adminUser');
const adminPass = document.getElementById('adminPass');
const authError = document.getElementById('authError');
const deviceCodeInput = document.getElementById('deviceCodeInput');
const adminActionMsg = document.getElementById('adminActionMsg');

let isProcessing = false;
let isRootVerActivated = false; // Trạng thái kích hoạt ROOTVER

// Đóng modal thông báo ban đầu
readBtn.addEventListener('click', () => {
    noticeModal.style.display = 'none';
    input.focus();
});

// Xử lý giữ Avatar 3 giây để mở bảng Đăng nhập Admin
let pressTimer;

function startPress() {
    pressTimer = setTimeout(() => {
        adminAuthModal.style.display = 'flex';
        adminUser.value = '';
        adminPass.value = '';
        authError.innerText = '';
    }, 3000); // 3 giây
}

function cancelPress() {
    clearTimeout(pressTimer);
}

avatarTrigger.addEventListener('mousedown', startPress);
avatarTrigger.addEventListener('mouseup', cancelPress);
avatarTrigger.addEventListener('mouseleave', cancelPress);

avatarTrigger.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startPress();
});
avatarTrigger.addEventListener('touchend', cancelPress);

// Đăng nhập Admin
loginBtn.addEventListener('click', () => {
    const user = adminUser.value.trim();
    const pass = adminPass.value.trim();

    if (user === 'TDZADMIN' && pass === 'TDZ2013@') {
        adminAuthModal.style.display = 'none';
        adminPanelModal.style.display = 'flex';
        adminActionMsg.innerText = '';
    } else {
        authError.innerText = 'Tài khoản hoặc mật khẩu không chính xác!';
    }
});

cancelLoginBtn.addEventListener('click', () => {
    adminAuthModal.style.display = 'none';
    input.focus();
});

closeAdminBtn.addEventListener('click', () => {
    adminPanelModal.style.display = 'none';
    input.focus();
});

// Kích hoạt Mã Online trên Bảng Admin
activateCodeBtn.addEventListener('click', () => {
    const code = deviceCodeInput.value.trim();
    if (code !== '') {
        isRootVerActivated = true;
        adminActionMsg.style.color = '#33ff77';
        adminActionMsg.innerText = `Đã kích hoạt mã: ${code} thành công!`;
        deviceCodeInput.value = '';
    } else {
        adminActionMsg.style.color = '#ff3333';
        adminActionMsg.innerText = 'Vui lòng nhập mã hợp lệ!';
    }
});

// Danh sách các câu lệnh
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
</div>
`,
    'status': `
<span class="line info">[SYSTEM STATUS]</span>
  - Security Guard : <span class="line success">BYPASSED</span>
  - Memory Offset  : <span class="line success">READY (0x7F)</span>
  - Latency        : <span class="line info">12ms</span>
  - License Status : <span class="line success">VIP LIFETIME</span>
`
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
            runRootVerCheck();
            break;
        default:
            printLine(`<span class="line dim">bash: ${escapeHtml(cmd)}: command not found. Gõ 'help' để xem danh sách lệnh.</span>`);
    }
}

function runRootVerCheck() {
    isProcessing = true;
    printLine(`<span class="line info">[+] Đang kiểm tra xác minh ROOTVER thiết bị...</span>`);

    setTimeout(() => {
        if (isRootVerActivated) {
            printLine(`<span class="line success">[✓] ROOTVER VERIFICATION: THÀNH CÔNG (SUCCESS)</span>`);
            printLine(`<span class="line success">[+] Thiết bị đã được cấp quyền ROOT hợp lệ!</span>`);
        } else {
            printLine(`<span class="line dim" style="color: #ff3333;">[X] LỖI: Điện thoại của bạn không thể sử dụng mà không ROOTVER!</span>`);
            printLine(`<span class="line info">[i] Tương tác qua Telegram để nhận mã xác minh thiết bị của bạn.</span>`);
        }
        isProcessing = false;
    }, 800);
}

function runToggleScript(name, memAddr) {
    isProcessing = true;
    printLine(`<span class="line info">[+] Đang kích hoạt: ${name}...</span>`);
    
    setTimeout(() => {
        printLine(`<span class="line dim">[>] Ghi đè địa chỉ bộ nhớ ${memAddr}...</span>`);
    }, 350);

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
