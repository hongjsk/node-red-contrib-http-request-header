/**
 * Copyright 2018 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
  var mustache = require('mustache')

  function NodeFunction (config) {
    RED.nodes.createNode(this, config)
    this.items = config.items
    this.property = config.property
    this.propertyType = config.propertyType || 'msg'

    var node = this
    node.on('input', function (msg) {
      // Process Message
      msg.headers = msg.headers || {}

      node.items.map(function (item) {
        var k = item.k
        if (!k) {
          node.error(`Invalid Key: ${k}`, msg)
          return
        }
        
        var prop = RED.util.evaluateNodeProperty(item.v, item.vt, node, msg)
        var isTemplatedValue = (prop || '').indexOf('{{') != -1

        msg.headers[k] = (isTemplatedValue ? mustache.render(prop, msg) : prop)
      })

      node.send(msg)
    })

    this.on('close', function() {
    })
  }
  
  RED.nodes.registerType('http-request-header', NodeFunction)
}
