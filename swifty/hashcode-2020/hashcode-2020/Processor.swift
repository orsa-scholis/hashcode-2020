//
// Created by Lukas Bischof on 24.02.20.
// Copyright (c) 2020 lukas. All rights reserved.
//

import Foundation

class Processor {
  fileprivate let context: Context
  fileprivate var processingLibs: [Library]
  fileprivate var scannedBooks: Set<Int> = Set()

  init(context: Context) {
    self.context = context
    self.processingLibs = Array(context.libs)
  }

  func process() -> [Library] {
    sort()

    while !processingLibs.isEmpty {
      if processingLibs.count % 10 == 0 {
        print("Reordered")
        print("Already scanned \(scannedBooks.count) books")
        removeDuplicates()
        sort()
      }

      var winner = processingLibs.first!
      winner.scanBooks(ids: winner.availableBookIds())
      context.signup(winner)
      winner.availableBookIds().forEach({ scannedBooks.insert($0) })

      processingLibs.remove(at: 0)
    }

    return context.signedUp
  }

  private func removeDuplicates() {
    for var lib in processingLibs {
      lib.books.removeAll { scannedBooks.contains($0.id) }
    }

    processingLibs = processingLibs.filter({ !$0.books.isEmpty })
  }

  private func sort() {
    processingLibs.sort { (left: Library, right: Library) in
      let leftScore = left.summedScore()
      let rightScore = right.summedScore()

      if leftScore == rightScore {
        if left.signup == right.signup {
          return left.shipmentRate > right.shipmentRate
        }

        return left.signup < right.signup
      }

      return leftScore > rightScore
    }
  }
}
