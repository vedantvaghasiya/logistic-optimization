const graph = {};

document.getElementById("addData").addEventListener("click", function () {
  let start = document.getElementById("start").value.toUpperCase();
  let end = document.getElementById("end").value.toUpperCase();
  let cost = parseFloat(document.getElementById("cost").value);
  let timeInput = document.getElementById("time").value;
  let time = convertTimeToSeconds(timeInput);
  if (isNaN(cost) || isNaN(time)) {
    alert("Please enter valid cost and time values.");
    return;
  }
  if (!graph[start]) graph[start] = {};
  graph[start][end] = { cost, time };
  alert("Data saved successfully!");
  document.getElementById("start").value = "";
  document.getElementById("end").value = "";
  document.getElementById("cost").value = "";
  document.getElementById("time").value = "";
});

function convertTimeToSeconds(timeStr) {
  let parts = timeStr.split(":").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return NaN;
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
}

function findOptimalRoute(type) {
  let start = prompt("Enter start city:").toUpperCase();
  let end = prompt("Enter end city:").toUpperCase();
  let route = dijkstra(graph, start, end, type);
  if (!route) {
    document.getElementById("result").innerText = "No valid route found.";
    return;
  }
  document.getElementById("result").innerText = `Best Route: ${route.path.join(
    " → ",
  )} \n Cost: ${route.cost}, Time: ${convertSecondsToTime(route.time)}`;
}

function dijkstra(graph, start, end, key) {
  if (!graph[start]) return null;
  let distances = {},
    previous = {},
    pq = new Set(Object.keys(graph));
  Object.keys(graph).forEach((node) => (distances[node] = Infinity));
  distances[start] = 0;

  while (pq.size > 0) {
    let minNode = [...pq].reduce((a, b) =>
      distances[a] < distances[b] ? a : b,
    );
    pq.delete(minNode);
    if (minNode === end) break;
    if (distances[minNode] === Infinity) continue;

    for (let neighbor in graph[minNode]) {
      let newDist = distances[minNode] + graph[minNode][neighbor][key];
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        previous[neighbor] = minNode;
      }
    }
  }

  if (distances[end] === Infinity) return null;
  let path = [],
    current = end;
  while (current) {
    path.unshift(current);
    current = previous[current];
  }
  return {
    path,
    cost: distances[end],
    time: key === "time" ? distances[end] : null,
  };
}

function convertSecondsToTime(seconds) {
  if (isNaN(seconds)) return "Invalid Time";
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  let secs = seconds % 60;
  return `${hours}:${minutes}:${secs}`;
}
