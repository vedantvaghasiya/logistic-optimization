const graph = {};

document.getElementById("addData").addEventListener("click", function () {
  let start = document.getElementById("start").value.toUpperCase();
  let end = document.getElementById("end").value.toUpperCase();
  let cost = parseFloat(document.getElementById("cost").value);
  let timeInput = parseFloat(document.getElementById("time").value);
  let time = convertTimeToSeconds(timeInput);
  if (isNaN(cost) || isNaN(time)) {
    alert("Please enter valid cost and time values.");
    return;
  }
  if (!graph[start]) graph[start] = {};
  graph[start][end] = { cost, time };
  console.log(typeof cost, time);
  alert("Data saved successfully!");
  document.getElementById("start").value = "";
  document.getElementById("end").value = "";
  document.getElementById("cost").value = "";
  document.getElementById("time").value = "";
});

function convertTimeToSeconds(timeStr) {
  return timeStr;
}

function findOptimalRoute(type) {
  let start = prompt("Enter start city:").toUpperCase();
  let end = prompt("Enter end city:").toUpperCase();
  let route = dijkstra(graph, start, end, type);
  console.log("optimal route: ", route);
  if (!route) {
    document.getElementById("result").innerText = "No valid route found.";
    return;
  }
  document.getElementById("result").innerHTML = `
  <div style="
    background: #f8f9fa;
    border-left: 5px solid #007bff;
    padding: 12px;
    font-size: 18px;
    font-weight: bold;
    color: #333;
    border-radius: 5px;
    width: fit-content;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  ">
    <p style="margin: 5px 0;">
      <strong>Best Route:</strong> 
      <span style="color: #28a745;">${route.path.join(" → ")}</span>
    </p>
    <p style="margin: 5px 0;">
      <strong>${type}:</strong> 
      <span style="color: #007bff;">${route.cost}</span>
    </p>
  </div>
`;
}

function dijkstra(graph, start, end, key) {
  console.log("Graph:", graph);
  if (!graph[start]) return null; // Edge case: Start node doesn't exist

  let distances = {},
    previous = {},
    pq = new Set(Object.keys(graph));

  // Collect all nodes (both direct keys and children)
  Object.keys(graph).forEach((node) => {
    distances[node] = Infinity;
    pq.add(node);
    // Also add child nodes that may not be direct keys in graph
    Object.keys(graph[node]).forEach((neighbor) => {
      distances[neighbor] = Infinity;
      pq.add(neighbor);
    });
  });
  // // Initialize distances
  // Object.keys(graph).forEach((node) => (distances[node] = Infinity));
  distances[start] = 0;

  console.log(pq);
  while (pq.size > 0) {
    // Find the node with the smallest distance
    console.log([...pq]);
    let minNode = [...pq].reduce((a, b) =>
      distances[a] < distances[b] ? a : b
    );
    pq.delete(minNode);

    // Stop if we've reached the target node
    if (minNode === end) break;
    if (distances[minNode] === Infinity) continue; // Unreachable nodes

    // Relaxation step: Update distances of neighboring nodes
    for (let neighbor in graph[minNode]) {
      let weight = graph[minNode][neighbor]?.[key] ?? Infinity;
      console.log(neighbor, weight);
      if (weight === Infinity) continue;

      let newDist = distances[minNode] + weight;
      console.log(newDist);
      if (newDist < distances[neighbor]) {
        console.log("here");
        distances[neighbor] = newDist;
        console.log("this: ", distances[neighbor], newDist);
        previous[neighbor] = minNode;
      }
    }
  }

  // If end node is unreachable
  if (distances[end] === Infinity) return null;

  // Reconstruct shortest path
  let path = [];
  let current = end;
  while (current !== undefined) {
    path.unshift(current);
    current = previous[current];
  }

  return {
    path,
    cost: distances[end],
  };
}

function convertSecondsToTime(seconds) {
  if (isNaN(seconds)) return "Invalid Time";
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  let secs = seconds % 60;
  return `${hours}:${minutes}:${secs}`;
}
