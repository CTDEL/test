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

local itemName = "mekanism:hpde_pellet"
local lastCount = countItem(itemName)

monitor.setTextScale(2)

while true do
  sleep(60)
  local current = countItem(itemName)
  local perMinute = current - lastCount
  lastCount = current

  monitor.clear()
  monitor.setCursorPos(1, 1)
  monitor.write("Factory Status")
  monitor.setCursorPos(1, 2)
  monitor.write("Stock: " .. current)
  monitor.setCursorPos(1, 3)
  monitor.write("Per min: " .. perMinute)
end
