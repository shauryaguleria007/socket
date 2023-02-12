class MessageStore {
  saveMessage(message) {}
  findMessagesForUser(userId) {}
}

class InMemoryMessageStore extends MessageStore {
  constructor() {
    super()
    this.message = []
  }
  saveMessage(message) {
    this.message.push(message)
  }
  findMessagesForUser(userId) {
    return this.message.filter(
      ({ from, to }) => from === userId || to === userId
    )
  }
}

module.exports = {
  InMemoryMessageStore,
}
