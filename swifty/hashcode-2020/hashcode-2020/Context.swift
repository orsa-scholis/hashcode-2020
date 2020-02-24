//
//  Context.swift
//  hashcode-2020
//
//  Created by Lukas Bischof on 24.02.20.
//  Copyright © 2020 lukas. All rights reserved.
//

import Foundation

class Context: CustomStringConvertible {
  public var libs: [Library] = []
  public var signedUp: [Library] = []
  public var deadline: Int = 0;
  
  init() { }

  var description: String {
    "Context(libs: \(libs), deadline: \(deadline))"
  }

  func addLib(lib: Library) {
    libs.append(lib)
  }

  func signup(_ lib: Library) {
    signedUp.append(lib)
  }
}
