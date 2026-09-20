local chest = peripheral.find("inventory")
local monitor = peripheral.find("monitor")

local function countItem(name)
  local total = 0
  for slot, item in pairs(chest.list()) do
    if item.name == name then
      total = total + item.count
    end
  end
  return total
end

local function centerText(mon, y, text, textColor, bgColor)
  local w, h = mon.getSize()
  local x = math.floor((w - #text) / 2) + 1
  mon.setBackgroundColor(bgColor or colors.black)
  mon.setTextColor(textColor or colors.white)
  mon.setCursorPos(1, y)
  mon.write(string.rep(" ", w))
  mon.setCursorPos(x, y)
  mon.write(text)
end

local itemName = "minecraft:iron_ingot"
local lastCount = countItem(itemName)

monitor.setTextScale(1)
local w, h = monitor.getSize()

while true do
  sleep(60)
  local current = countItem(itemName)
  local perMinute = current - lastCount
  lastCount = current

  monitor.setBackgroundColor(colors.black)
  monitor.clear()

  -- 상단 제목 바 (배경색 강조)
  centerText(monitor, 1, "FACTORY STATUS", colors.white, colors.blue)

  -- 구분선
  monitor.setBackgroundColor(colors.black)
  monitor.setTextColor(colors.gray)
  monitor.setCursorPos(1, 2)
  monitor.write(string.rep("-", w))

  -- 재고 (노란색 강조)
  centerText(monitor, 4, "STOCK", colors.lightGray, colors.black)
  centerText(monitor, 5, tostring(current), colors.yellow, colors.black)

  -- 생산량 (초록/빨강으로 증감 표시)
  centerText(monitor, 7, "PER MINUTE", colors.lightGray, colors.black)
  local rateColor = perMinute > 0 and colors.lime or colors.red
  centerText(monitor, 8, (perMinute >= 0 and "+" or "") .. perMinute, rateColor, colors.black)

  -- 하단 진행 바 (분당 200개 기준, 취향껏 숫자 조절)
  local maxRate = 200
  local barWidth = w - 4
  local filled = math.floor(math.min(perMinute / maxRate, 1) * barWidth)
  monitor.setCursorPos(3, h - 1)
  monitor.setBackgroundColor(colors.gray)
  monitor.write(string.rep(" ", barWidth))
  monitor.setCursorPos(3, h - 1)
  monitor.setBackgroundColor(colors.lime)
  monitor.write(string.rep(" ", filled))
  monitor.setBackgroundColor(colors.black)
end
