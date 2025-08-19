import binascii
import time

def to_hex(s: str) -> str:
    return binascii.hexlify(s.encode("utf-8")).decode("utf-8").upper()

def gen_url(base_url, maid, expire_seconds=600, title="你好", desc="我喜欢你"):
    # 到期时间戳（秒级）
    l = int(time.time()) + expire_seconds
    t = to_hex(title)
    d = to_hex(desc)

    url = f"{base_url}/qrcode/req/{maid}.html?l={l}&t={t}&d={d}"
    return url

if __name__ == "__main__":
    # 示例
    base = "https://wq.sys-allnet.cn"
    maid = "MAID2508191234567890"

    link = gen_url(base, maid, 600, "我好", "你喜欢我")
    print("生成链接：", link)
