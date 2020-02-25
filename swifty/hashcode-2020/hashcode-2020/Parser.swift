//
//  Parser.swift
//  hashcode-2020
//
//  Created by Lukas Bischof on 24.02.20.
//  Copyright © 2020 lukas. All rights reserved.
//

import Foundation

class Parser {
  fileprivate var content: [String]
  fileprivate var availableBooks: [Int: Int] = [:]

  init(content: String) {
    self.content = content.split(separator: "\n").map(String.init)
  }

  func parse() -> Context {
    let context = Context()

    let contextMeta = splitLine(line: content.first!)
    context.booksCount = contextMeta[0]
    context.deadline = contextMeta[2]
    splitLine(line: content[1]).enumerated().forEach { index, score in availableBooks[index] = score }

    for i in stride(from: 2, to: content.count, by: 2) {
      let id = (i / 2) - 1
      context.addLib(lib: generateLib(meta: splitLine(line: content[i]), bookIds: splitLine(line: content[i + 1]), id: id))
    }

    return context
  }

  private func generateLib(meta: [Int], bookIds: [Int], id: Int) -> Library {
    let books = bookIds.map { (bookId) -> Book in
      Book(id: bookId, score: availableBooks[bookId]!)
    }

    return Library(id: id, books: books, signup: meta[1], shipmentRate: meta[2])
  }

  private func splitLine(line: String) -> [Int] {
    line.split(separator: " ").map { Int(String($0))! }
  }
}
