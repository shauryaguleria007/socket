class SessionStore {
  findSession(id) {}
  saveSession(id, session) {}
  findAllSessions() {}
}

class InMemorySessionStore extends SessionStore {
  constructor() {
    super()
    this.session = new Map()
  }

  findSession(id) {
    return this.session.get(id)
  }
  saveSession(id, session) {
    this.sessions.set(id, session)
  }
  findAllSessions() {
    return [...this.session.values()]
  }
}

module.exports = { InMemorySessionStore }
