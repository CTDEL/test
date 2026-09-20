local monitor = peripheral.find("monitor")
local reactor = peripheral.wrap("fusionReactorLogicAdapter_0")

if not reactor then error("Fusion reactor adapter not found") end
if not monitor then error("Monitor not found") end

monitor.setTextScale(1)
local w, h = monitor.getSize()

local function safe(fn, ...)
  if not fn then return nil end
  local ok, result = pcall(fn, ...)
  if ok then return result else return nil end
end

-- 테이블로 오면 amount 필드를 꺼내고, 숫자면 그대로 반환
local function amt(v)
  if type(v) == "table" then
    return v.amount
  end
  return v
end

local function fmt(n, d)
  if n == nil then return "N/A" end
  return string.format("%." .. (d or 1) .. "f", n)
end

local lastRate = amt(safe(reactor.getInjectionRate)) or 0
if lastRate == 0 then lastRate = amt(safe(reactor.getMinInjectionRate)) or 10 end

local buttons = {}

local function addButton(x1, y1, x2, y2, label, action)
  table.insert(buttons, {x1=x1, y1=y1, x2=x2, y2=y2, label=label, action=action})
end

local function drawButton(b, bg)
  monitor.setBackgroundColor(bg)
  monitor.setTextColor(colors.white)
  for y = b.y1, b.y2 do
    monitor.setCursorPos(b.x1, y)
    monitor.write(string.rep(" ", b.x2 - b.x1 + 1))
  end
  monitor.setCursorPos(b.x1 + math.floor(((b.x2-b.x1+1)-#b.label)/2), math.floor((b.y1+b.y2)/2))
  monitor.write(b.label)
end

local function draw()
  buttons = {}
  monitor.setBackgroundColor(colors.black)
  monitor.clear()

  local formed = safe(reactor.isFormed)
  local rate = amt(safe(reactor.getInjectionRate)) or 0
  local running = rate > 0

  monitor.setBackgroundColor(running and colors.green or colors.red)
  monitor.setCursorPos(1, 1)
  monitor.write(string.rep(" ", w))
  local statusText = (not formed) and "NOT FORMED" or (running and "RUNNING" or "STOPPED")
  monitor.setCursorPos(math.floor((w-#statusText)/2)+1, 1)
  monitor.setTextColor(colors.white)
  monitor.write(statusText)

  monitor.setBackgroundColor(colors.black)

  -- Heat stats
  monitor.setCursorPos(2, 3)
  monitor.write("Plasma " .. fmt(amt(safe(reactor.getPlasmaTemperature))) .. "K / " .. fmt(amt(safe(reactor.getMaxPlasmaTemperature))) .. "K")
  monitor.setCursorPos(2, 4)
  monitor.write("Casing " .. fmt(amt(safe(reactor.getCaseTemperature))) .. "K / " .. fmt(amt(safe(reactor.getMaxCasingTemperature))) .. "K")
  monitor.setCursorPos(2, 5)
  monitor.write("Ignite " .. fmt(amt(safe(reactor.getIgnitionTemperature))) .. "K")

  -- Fuel stats
  local dt, dtCap = amt(safe(reactor.getDTFuel)), amt(safe(reactor.getDTFuelCapacity))
  monitor.setCursorPos(2, 7)
  monitor.write("DT Fuel  " .. (dt and math.floor(dt) or "N/A") .. "/" .. (dtCap and math.floor(dtCap) or "N/A"))
  local deu, deuCap = amt(safe(reactor.getDeuterium)), amt(safe(reactor.getDeuteriumCapacity))
  monitor.setCursorPos(2, 8)
  monitor.write("Deuterium " .. (deu and math.floor(deu) or "N/A") .. "/" .. (deuCap and math.floor(deuCap) or "N/A"))
  local tri, triCap = amt(safe(reactor.getTritium)), amt(safe(reactor.getTritiumCapacity))
  monitor.setCursorPos(2, 9)
  monitor.write("Tritium   " .. (tri and math.floor(tri) or "N/A") .. "/" .. (triCap and math.floor(triCap) or "N/A"))

  -- Power output
  monitor.setCursorPos(2, 11)
  monitor.write("Production " .. fmt(amt(safe(reactor.getProductionRate))))
  monitor.setCursorPos(2, 12)
  monitor.write("Injection Rate " .. fmt(rate, 0))

  addButton(2, 14, 6, 15, "-1", "dec")
  addButton(8, 14, 12, 15, "+1", "inc")
  addButton(2, 17, math.floor(w/2)-1, 18, "START", "start")
  addButton(math.floor(w/2)+1, 17, w-1, 18, "STOP", "stop")

  for _, b in ipairs(buttons) do
    local bg = colors.gray
    if b.action == "start" then bg = colors.green end
    if b.action == "stop" then bg = colors.red end
    drawButton(b, bg)
  end
end

local function autoRefresh()
  while true do
    sleep(2)
    draw()
  end
end

local function handleTouch()
  while true do
    local _, _, x, y = os.pullEvent("monitor_touch")
    for _, b in ipairs(buttons) do
      if x >= b.x1 and x <= b.x2 and y >= b.y1 and y <= b.y2 then
        if b.action == "start" then
          safe(reactor.setInjectionRate, lastRate)
        elseif b.action == "stop" then
          lastRate = amt(safe(reactor.getInjectionRate)) or lastRate
          safe(reactor.setInjectionRate, 0)
        elseif b.action == "inc" then
          lastRate = lastRate + 1
          safe(reactor.setInjectionRate, lastRate)
        elseif b.action == "dec" then
          lastRate = math.max(0, lastRate - 1)
          safe(reactor.setInjectionRate, lastRate)
        end
      end
    end
    draw()
  end
end

draw()
parallel.waitForAny(autoRefresh, handleTouch)
