local chest = peripheral.find("inventory")
local monitor = peripheral.find("monitor")

if not chest then error("Chest/inventory not found") end
if not monitor then error("Monitor not found") end

monitor.setTextScale(1)
local w, h = monitor.getSize()

local function getUsage()
  local totalSlots = chest.size()
  local items = chest.list()
  local current = 0
  local capacity = 0

  for slot = 1, totalSlots do
    local item = items[slot]
    if item then
      current = current + item.count
      local detail = chest.getItemDetail(slot)
      local maxStack = (detail and detail.maxCount) or 64
      capacity = capacity + maxStack
    else
      capacity = capacity + 64
    end
  end

  return current, capacity
end

local function draw()
  local current, capacity = getUsage()
  local percent = capacity > 0 and (current / capacity) or 0

  monitor.setBackgroundColor(colors.black)
  monitor.clear()

  monitor.setTextColor(colors.white)
  monitor.setCursorPos(2, 1)
  monitor.write("Storage Status")

  monitor.setCursorPos(2, 3)
  monitor.write("Items: " .. current .. " / " .. capacity)

  monitor.setCursorPos(2, 4)
  monitor.write(string.format("Fill: %.1f%%", percent * 100))

  local barWidth = w - 4
  local filled = math.floor(percent * barWidth)

  local barColor = colors.lime
  if percent > 0.9 then barColor = colors.red
  elseif percent > 0.6 then barColor = colors.yellow end

  monitor.setCursorPos(3, 6)
  monitor.setBackgroundColor(colors.gray)
  monitor.write(string.rep(" ", barWidth))
  monitor.setCursorPos(3, 6)
  monitor.setBackgroundColor(barColor)
  monitor.write(string.rep(" ", filled))
  monitor.setBackgroundColor(colors.black)
end

while true do
  draw()
  sleep(5)
end
