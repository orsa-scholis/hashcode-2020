//
// Created by Lukas Bischof on 24.02.20.
// Copyright (c) 2020 lukas. All rights reserved.
//

import Foundation

struct Library {
  var id: Int;
  var books: [Book]
  var signup: Int
  var shipmentRate: Int
  var scannableBookIds: Set<Int> = Set()

  mutating func scanBook(id: Int) {
    scannableBookIds.insert(id)
  }

  mutating func scanBooks(ids: [Int]) {
    ids.forEach { scannableBookIds.insert($0) }
  }

  func summedScore() -> Int {
    books.map { $0.score }.reduce(into: 0, { $0 + $1 })
  }

  func availableBookIds() -> [Int] {
    books.sorted(by: { $0.score > $1.score }).map({ $0.id })
  }
}
