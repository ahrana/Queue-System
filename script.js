 let queue = [];
    let queueNumber = 1;
    let counters = 3; // Number of customer care counters
    let totalServices = 0;

    function updateQueueDisplay() {
      const queueDisplay = document.getElementById("queueDisplay");
      queueDisplay.innerHTML = queue.map((customer, index) => `<div>Token number: ${index + 1} | ${customer.name} | Service: ${customer.service}</div>`).join("");
    }

    function updateNewCustomerWaitingTime() {
      const serviceName = document.getElementById("serviceName").value;
      const estimatedWaitingTime = calculateEstimatedWaitingTime(serviceName);
      const remainingMinutes = Math.floor(estimatedWaitingTime / 60000);
      const remainingSeconds = Math.floor((estimatedWaitingTime % 60000) / 1000);
      document.getElementById("newCustomerWaitingTime").innerText = `${remainingMinutes}m ${remainingSeconds}s`;
    }

    function joinQueue() {
      const customerName = prompt("Please enter your name:");
      if (customerName) {
        const serviceName = document.getElementById("serviceName").value;
        const estimatedWaitingTime = calculateEstimatedWaitingTime(serviceName);
        const customer = {
          name: customerName,
          service: serviceName,
          startTime: Date.now(),
        };
        queue.push(customer);
        updateQueueDisplay();
        alert(`Welcome to the queue, ${customerName}! Your queue number is ${queueNumber}.`);
        queueNumber++;
        updateWaitingTimeEstimations();
      }
    }

    function updateCounters() {
      const countersContainer = document.getElementById("counters");
      countersContainer.innerHTML = '';
      for (let i = 1; i <= counters; i++) {
        countersContainer.innerHTML += `
          <div class="counter" id="counter${i}">
            <i class="fas fa-user counter-icon"></i>
            <div class="counter-number">0</div>
            <div class="counter-service"></div>
            <button class="counter-button" onclick="serveNext(${i})">Serve Next</button>
          </div>
        `;
      }
    }

    function serveNext(counterIndex) {
      if (queue.length > 0) {
        const nextCustomer = queue.shift();
        updateQueueDisplay();
        document.getElementById(`counter${counterIndex}`).classList.add("counter-animating");
        setTimeout(() => {
          document.getElementById(`counter${counterIndex}`).classList.remove("counter-animating");
          const counterElement = document.getElementById(`counter${counterIndex}`);
          counterElement.getElementsByClassName("counter-number")[0].innerText = nextCustomer.name;
          counterElement.getElementsByClassName("counter-service")[0].innerText = nextCustomer.service;
          totalServices++;
          document.getElementById("totalServices").innerText = totalServices;
          updateWaitingTimeEstimations();
        }, 600);
      } else {
        alert("Queue is empty.");
      }
    }

    function updateWaitingTimeEstimations() {
      const currentTime = Date.now();
      const waitingTimeElements = document.querySelectorAll(".waiting-time");
      waitingTimeElements.forEach((element, index) => {
        if (queue[index]) {
          const serviceStartTime = queue[index].startTime;
          const serviceDuration = getServiceDuration(queue[index].service);
          const elapsedTime = currentTime - serviceStartTime;
          const remainingTime = Math.max(serviceDuration - elapsedTime, 0);
          const remainingMinutes = Math.floor(remainingTime / 60000);
          const remainingSeconds = Math.floor((remainingTime % 60000) / 1000);
          element.innerText = `Estimated Waiting Time: ${remainingMinutes}m ${remainingSeconds}s`;
        } else {
          element.innerText = "Estimated Waiting Time: N/A";
        }
      });
    }

    function calculateEstimatedWaitingTime(service) {
      // Adjust service durations as needed
      const serviceDurations = {
        customer_services: 10 * 60000, // 10 minutes
        account: 5 * 60000, // 5 minutes
        billing_info: 7 * 60000, // 7 minutes
        general_issues: 8 * 60000, // 8 minutes
      };
      return serviceDurations[service] || 10 * 60000; // Default: 10 minutes
    }

    updateCounters();
    setInterval(updateWaitingTimeEstimations, 1000);
    document.getElementById("serviceName").addEventListener("change", updateNewCustomerWaitingTime);
     
      // Function to toggle social icons display
    function toggleSocialIcons() {
      const socialIcons = document.getElementById("socialIcons");
      socialIcons.classList.toggle("show");
    }
