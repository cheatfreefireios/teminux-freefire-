// ==========================================
// 1. CẤU HÌNH HỆ THỐNG KEY & GIAO DIỆN
// ==========================================
const KEY_CONFIG = {
    getKeyUrl: "https://bbmkts.com/ql?token=e3ed5e88fefd828697e1c0db&longurl=https://thinhkk999.github.io/getkey/",
    validKeys: ["TDZ-VIP-2026", "TERMUX-FREE-999", "THINH999"],
    keyPrefix: "TDZ-",
    expireHours: 24
};

// Tự động chèn CSS cho màn hình Key vào trang
const keyStyle = document.createElement("style");
keyStyle.innerHTML = `
    #tdz-key-gate {
        position: fixed;
        inset: 0;
        background: radial-gradient(circle at center, #1a0808 0%, #09090b 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        z-index: 999999;
        font-family: 'Courier New', Courier, monospace;
        user-select: none;
    }
    .tdz-key-box {
        width: 100%;
        max-width: 400px;
        background: #121215;
        border: 1px solid #ef4444;
        box-shadow: 0 0 25px rgba(239, 68, 68, 0.4);
        border-radius: 8px;
        padding: 24px;
        text-align: center;
        color: #f4f4f5;
    }
    .tdz-ascii {
        color: #ef4444;
        font-size: 9px;
        line-height: 1.2;
        margin-bottom: 16px;
        font-weight: bold;
        text-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
        overflow-x: hidden;
    }
    .tdz-title { font-size: 18px; font-weight: bold; letter-spacing: 2px; color: #fff; margin-bottom: 6px; }
    .tdz-subtitle { font-size: 12px; color: #a1a1aa; margin-bottom: 20px; }
    .tdz-input-group { margin-bottom: 16px; text-align: left; }
    .tdz-input-group label { display: block; font-size: 11px; color: #ef4444; margin-bottom: 6px; font-weight: bold; }
    .tdz-key-input {
        width: 100%; box-sizing: border-box; background: #050505; border: 1px solid #27272a;
        color: #fff; padding: 12px; border-radius: 6px; font-size: 14px; font-family: inherit; outline: none;
    }
    .tdz-key-input:focus { border-color: #ef4444; box-shadow: 0 0 10px rgba(239, 68, 68, 0.2); }
    .tdz-btn-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .tdz-btn {
        padding: 12px; border-radius: 6px; font-weight: bold; font-size: 13px; font-family: inherit;
        cursor: pointer; border: none; text-transform: uppercase; letter-spacing: 1px; transition: all 0.2s;
    }
    .tdz-btn-getkey { background: transparent; border: 1px solid #ef4444; color: #ef4444; }
    .tdz-btn-getkey:hover { background: rgba(239, 68, 68, 0.15); }
    .tdz-btn-login { background: #ef4444; color: #fff; box-shadow: 0 0 15px rgba(239, 68, 68, 0.4); }
    #tdz-key-status { margin-top: 14px; font-size: 12px; min-height: 18px; }
`;
document.head.appendChild(keyStyle);

// ==========================================
// 2. KHỞI TẠO & KIỂM TRA PHIÊN ĐĂNG NHẬP
// ==========================================
function initAppAuth() {
    const savedAuth = localStorage.getItem("termux_auth_time");
    if (savedAuth && (Date.now() - parseInt(savedAuth) < KEY_CONFIG.expireHours * 3600000)) {
        // Đã xác thực -> Chạy trực tiếp app chính
        startTermuxApp();
        return;
    }

    // Chưa xác thực -> Hiện bảng nhập Key
    const gateHTML = `
        <div id="tdz-key-gate">
            <div class="tdz-key-box">
                <pre class="tdz-ascii">
████████╗███████╗██████╗ ███╗   ███╗██╗   ██╗██╗  ██╗
╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║   ██║╚██╗██╔╝
   ██║   █████╗  ██████╔╝██╔████╔██║██║   ██║ ╚███╔╝ 
   ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║   ██║ ██╔██╗ 
   ██║   ███████╗██║  ██║██║ ╚═╝ ██║╚██████╔╝██╔╝ ██╗
   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝</pre>
                <div class="tdz-title">SYSTEM AUTHENTICATION</div>
                <div class="tdz-subtitle">Vui lòng vượt link để lấy Key kích hoạt phiên làm việc</div>

                <div class="tdz-input-group">
                    <label for="tdz-key-input">NHẬP LICENSE KEY:</label>
                    <input type="text" id="tdz-key-input" class="tdz-key-input" placeholder="Dán mã Key..." autocomplete="off">
                </div>

                <div class="tdz-btn-row">
                    <button type="button" id="tdz-btn-get" class="tdz-btn tdz-btn-getkey">GET KEY</button>
                    <button type="button" id="tdz-btn-verify" class="tdz-btn tdz-btn-login">ACCESS</button>
                </div>

                <div id="tdz-key-status"></div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML("beforeend", gateHTML);

    // Sự kiện nút Get Key (Đã fix lỗi chặn chuyển link trên mobile)
    document.getElementById("tdz-btn-get").addEventListener("click", () => {
        const statusEl = document.getElementById("tdz-key-status");
        statusEl.style.color = "#eab308";
        statusEl.innerText = "[*] Đang chuyển hướng sang trang lấy Key...";
        
        const a = document.createElement('a');
        a.href = KEY_CONFIG.getKeyUrl;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    // Sự kiện kiểm tra Key
    const verifyAction = () => {
        const val = document.getElementById("tdz-key-input").value.trim();
        const statusEl = document.getElementById("tdz-key-status");

        if (!val) {
            statusEl.style.color = "#ef4444";
            statusEl.innerText = "[!] Vui lòng nhập Key trước.";
            return;
        }

        if (KEY_CONFIG.validKeys.includes(val) || (KEY_CONFIG.keyPrefix && val.startsWith(KEY_CONFIG.keyPrefix))) {
            statusEl.style.color = "#22c55e";
            statusEl.innerText = "[✓] Thành công! Đang khởi động...";
            localStorage.setItem("termux_auth_time", Date.now().toString());
            setTimeout(() => {
                document.getElementById("tdz-key-gate").remove();
                startTermuxApp();
            }, 500);
        } else {
            statusEl.style.color = "#ef4444";
            statusEl.innerText = "[X] Key không chính xác!";
        }
    };

    document.getElementById("tdz-btn-verify").addEventListener("click", verifyAction);
    document.getElementById("tdz-key-input").addEventListener("keydown", (e) => {
        if (e.key === "Enter") verifyAction();
    });
}

// ==========================================
// 3. LOGIC CHÍNH CỦA TERMINAL (script.js)
// ==========================================
function startTermuxApp() {
    console.log("Termux Script Initialized!");
    
    // Đặt toàn bộ code xử lý lệnh, giao diện terminal của bạn vào đây...
}

// Tự động kích hoạt hệ thống check key khi script.js được tải
initAppAuth();
