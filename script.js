    let enrolledCourses = [];

    const dashNavBtn = document.querySelector('.dash-nav-btn');
    const enrolledCountEl = document.getElementById('enrolledCount');
    const completedLessonsEl = document.getElementById('completedLessons');
    const overallProgressEl = document.getElementById('overallProgress');
    const enrolledListContainer = document.getElementById('enrolledCoursesList');

    function updateDashboard() {
      dashNavBtn.textContent = `Student Dashboard (${enrolledCourses.length})`;
      enrolledCountEl.textContent = enrolledCourses.length;

      let totalCompleted = 0;
      let totalLessonsAvailable = 0;

      enrolledCourses.forEach(course => {
        totalCompleted += course.completed;
        totalLessonsAvailable += course.totalLessons;
      });

      completedLessonsEl.textContent = totalCompleted;
      const masteryPercent = totalLessonsAvailable > 0
        ? Math.round((totalCompleted / totalLessonsAvailable) * 100)
        : 0;
      overallProgressEl.textContent = `${masteryPercent}%`;

      if (enrolledCourses.length === 0) {
        enrolledListContainer.innerHTML = `<p class="empty-dash-msg">You haven't enrolled in any courses yet. Click <strong>"Enroll Now"</strong> on any course above to add it to your dashboard!</p>`;
        return;
      }

      enrolledListContainer.innerHTML = enrolledCourses.map((course, index) => {
        const pct = Math.round((course.completed / course.totalLessons) * 100);
        const isDone = course.completed >= course.totalLessons;

        return `
          <div class="enrolled-course-row">
            <div class="enrolled-top">
              <h4>${course.title}</h4>
              <span class="lesson-counter">${course.completed} / ${course.totalLessons} Lessons (${pct}%)</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" style="width: ${pct}%;"></div>
            </div>
            <div class="enrolled-actions">
              <button class="complete-lesson-btn" onclick="completeLesson(${index})" ${isDone ? 'disabled' : ''}>
                ${isDone ? 'Course Completed 🎓' : '+ Complete Lesson (+1)'}
              </button>
              <button class="drop-course-btn" onclick="dropCourse(${index})">Unenroll</button>
            </div>
          </div>
        `;
      }).join('');
    }

    window.completeLesson = function(index) {
      const course = enrolledCourses[index];
      if (course && course.completed < course.totalLessons) {
        course.completed++;
        updateDashboard();
      }
    };

    window.dropCourse = function(index) {
      enrolledCourses.splice(index, 1);
      updateDashboard();
    };

    document.querySelectorAll('.enroll-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-course');
        const totalLessons = parseInt(btn.getAttribute('data-lessons'), 10);

        const alreadyEnrolled = enrolledCourses.some(c => c.title === title);
        if (!alreadyEnrolled) {
          enrolledCourses.push({
            title,
            totalLessons,
            completed: 1 // Starts with Lesson 1 unlocked!
          });
          updateDashboard();
        }

        const originalText = btn.textContent;
        btn.textContent = 'Enrolled ✓';
        btn.style.backgroundColor = '#E59A24';
        btn.style.color = '#1F3A32';

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.backgroundColor = '';
          btn.style.color = '';
        }, 1000);
      });
    });