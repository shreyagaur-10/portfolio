const cursorGlow = document.querySelector('.cursor-glow')
const revealItems = document.querySelectorAll('.reveal')
const filterButtons = document.querySelectorAll('.filters button')
const projectCards = document.querySelectorAll('.project-card')
const counters = document.querySelectorAll('.counter')
const siteHeader = document.querySelector('.site-header')
const menuToggle = document.querySelector('.menu-toggle')
const mobileMenuLinks = document.querySelectorAll('.mobile-menu a')
const blogCards = document.querySelectorAll('[data-blog]')
const blogModal = document.querySelector('.blog-modal')
const blogTitle = document.querySelector('#blog-title')
const blogCategory = document.querySelector('#blog-category')
const blogBody = document.querySelector('#blog-body')
const blogCloseControls = document.querySelectorAll('[data-blog-close]')

const blogEntries = {
  'ai-inputs': {
    category: 'AI Products',
    title: 'Good AI apps start with reliable user input, not only a model.',
    body: [
      'A model is only one part of an AI product. In ShadeSense AI, the quality of the selfie matters as much as the prediction layer, because poor lighting, blur, shadows, or a tiny face region can quietly damage the result.',
      'That changed the way I think about AI interfaces. Instead of treating upload as a simple file field, the product needs to guide the user toward a better input and explain when confidence is low.',
      'The strongest AI products combine three layers: clear input collection, transparent analysis, and recommendations that users can understand. That is why ShadeSense checks lighting quality, capture quality, undertone, and color distance before showing product matches.',
    ],
    bullets: [
      'Design for input quality before optimizing model output.',
      'Show confidence and explain why a result may vary.',
      'Treat errors and warnings as part of the product experience.',
    ],
  },
  'frontend-states': {
    category: 'Frontend',
    title: 'Interfaces feel premium when states, spacing and feedback are treated as features.',
    body: [
      'A polished interface is not only about colors or animations. It is about what the user sees while waiting, what happens when something fails, and whether every element keeps its shape across devices.',
      'While building interactive product screens, I learned that loading states, empty states, disabled states, and visible error messages make the difference between a demo and a usable product.',
      'Good spacing also carries trust. When cards, buttons, and result sections are predictable, users understand the product faster and feel less friction moving through the workflow.',
    ],
    bullets: [
      'Every async action should have clear feedback.',
      'Responsive layouts need stable dimensions, not accidental resizing.',
      'Micro-interactions should support clarity, not distract from the task.',
    ],
  },
  'production-details': {
    category: 'Deployment',
    title: 'Production readiness is built from small details: CORS, health checks, logs and recovery paths.',
    body: [
      'A project is not truly finished when it works locally. Deployment reveals the hidden edges: environment variables, API URLs, CORS origins, port configuration, service worker caching, and health checks.',
      'For a Vercel frontend and DigitalOcean backend, the frontend must know the production API URL, and the backend must explicitly allow the frontend origin. Otherwise, the API can return 200 and still be blocked by the browser.',
      'That is why production readiness is a set of small, disciplined decisions. Good logs, health endpoints, safe defaults, and clear error messages make a system easier to operate and debug.',
    ],
    bullets: [
      'Keep backend health checks simple and public.',
      'Make environment variables explicit for each deployment platform.',
      'Write browser-facing errors that point to the real configuration issue.',
    ],
  },
}

window.addEventListener('pointermove', (event) => {
  if (!cursorGlow) return
  cursorGlow.style.left = `${event.clientX}px`
  cursorGlow.style.top = `${event.clientY}px`
})

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return
    entry.target.classList.add('visible')
    revealObserver.unobserve(entry.target)
  })
}, { threshold: 0.16 })

revealItems.forEach((item) => revealObserver.observe(item))

menuToggle?.addEventListener('click', () => {
  const isOpen = siteHeader.classList.toggle('menu-open')
  menuToggle.setAttribute('aria-expanded', String(isOpen))
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu')
})

mobileMenuLinks.forEach((link) => {
  link.addEventListener('click', () => {
    siteHeader.classList.remove('menu-open')
    menuToggle?.setAttribute('aria-expanded', 'false')
    menuToggle?.setAttribute('aria-label', 'Open navigation menu')
  })
})

document.addEventListener('click', (event) => {
  if (!siteHeader?.classList.contains('menu-open')) return
  if (siteHeader.contains(event.target)) return
  siteHeader.classList.remove('menu-open')
  menuToggle?.setAttribute('aria-expanded', 'false')
})

function openBlog(entryKey) {
  const entry = blogEntries[entryKey]
  if (!entry || !blogModal) return

  blogCategory.textContent = entry.category
  blogTitle.textContent = entry.title
  blogBody.innerHTML = `
    ${entry.body.map((paragraph) => `<p>${paragraph}</p>`).join('')}
    <ul>
      ${entry.bullets.map((bullet) => `<li>${bullet}</li>`).join('')}
    </ul>
  `

  blogModal.classList.add('open')
  blogModal.setAttribute('aria-hidden', 'false')
  document.body.style.overflow = 'hidden'
}

function closeBlog() {
  blogModal?.classList.remove('open')
  blogModal?.setAttribute('aria-hidden', 'true')
  document.body.style.overflow = ''
}

blogCards.forEach((card) => {
  card.addEventListener('click', () => openBlog(card.dataset.blog))
})

blogCloseControls.forEach((control) => {
  control.addEventListener('click', closeBlog)
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeBlog()
})

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter

    filterButtons.forEach((item) => item.classList.remove('active'))
    button.classList.add('active')

    projectCards.forEach((card) => {
      const types = card.dataset.type.split(' ')
      const shouldShow = filter === 'all' || types.includes(filter)
      card.classList.toggle('hidden', !shouldShow)
    })
  })
})

document.querySelectorAll('.tilt-card').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const rotateX = ((y / rect.height) - 0.5) * -5
    const rotateY = ((x / rect.width) - 0.5) * 5
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`
  })

  card.addEventListener('pointerleave', () => {
    card.style.transform = ''
  })
})

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return

    const counter = entry.target
    const target = Number(counter.dataset.count)
    let current = 0
    const steps = 36
    const increment = target / steps

    const timer = window.setInterval(() => {
      current += increment
      if (current >= target) {
        counter.textContent = target
        window.clearInterval(timer)
        return
      }
      counter.textContent = Math.round(current)
    }, 28)

    counterObserver.unobserve(counter)
  })
}, { threshold: 0.6 })

counters.forEach((counter) => counterObserver.observe(counter))

async function hydrateGithubProfile() {
  try {
    const [profileResponse, contributionResponse] = await Promise.all([
      fetch('https://api.github.com/users/shreyagaur-10'),
      fetch('https://github-contributions-api.jogruber.de/v4/shreyagaur-10?y=last'),
    ])

    if (!profileResponse.ok) return
    const profile = await profileResponse.json()

    const repoStat = document.querySelector('[data-github-repos]')
    const followerStat = document.querySelector('[data-github-followers]')
    const contributionStat = document.querySelector('[data-github-contributions]')
    const location = document.querySelector('[data-github-location]')

    if (repoStat) {
      repoStat.dataset.count = profile.public_repos || 0
      repoStat.textContent = profile.public_repos || 0
    }

    if (followerStat) {
      followerStat.dataset.count = profile.followers || 0
      followerStat.textContent = profile.followers || 0
    }

    if (location && profile.location) {
      location.textContent = profile.location
    }

    if (contributionResponse.ok) {
      const contributionData = await contributionResponse.json()
      const total = contributionData.total?.lastYear || 0
      const grid = document.querySelector('[data-contribution-grid]')

      if (contributionStat) {
        contributionStat.dataset.count = total
        contributionStat.textContent = total
      }

      if (grid && Array.isArray(contributionData.contributions)) {
        grid.innerHTML = ''
        contributionData.contributions.forEach((day, index) => {
          const cell = document.createElement('span')
          cell.dataset.level = String(day.level || 0)
          cell.title = `${day.date}: ${day.count} contributions`
          cell.style.animationDelay = `${Math.min(index * 0.002, 0.7)}s`
          grid.appendChild(cell)
        })
      }
    }
  } catch (error) {
    console.warn('GitHub profile stats could not be loaded.', error)
  }
}

hydrateGithubProfile()
