//
//  Writer.swift
//  hashcode-2020
//
//  Created by Lukas Bischof on 24.02.20.
//  Copyright © 2020 lukas. All rights reserved.
//

import Foundation

class Writer: CustomStringConvertible {
  fileprivate let libs: [Library]

  var description: String {
    "Writer(libs: \(libs))"
  }

  init(libs: [Library]) {
    self.libs = libs
  }

  func write(outputPath: String) {
    let content = serialize()

    do {
      try NSData(data: content.data(using: String.Encoding.utf8)!).write(toFile: outputPath)
    } catch {
      fatalError("Could not write")
    }
  }

  private func serialize() -> String {
    var output = [String(libs.count)]

    libs.forEach { library in
      output.append("\(library.id) \(library.scannableBookIds.count)")
      output.append(library.scannableBookIds.map { String($0) }.joined(separator: " "))
    }

    return output.joined(separator: "\n")
  }
}
