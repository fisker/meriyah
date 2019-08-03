import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';
describe('Expressions - Member', () => {
  fail('Expressions - Member (fail)', [['abc.123', Context.None], ['abc.£', Context.None]]);

  for (const arg of [
    'let f = () => { import("foo"); };',
    'foo["bar"];',
    'foo.bar;',
    'foo.bar.foo;',
    'foo.bar["foo"];',
    'foo["foo"]["bar"];',
    'foo[test()][bar()];',
    '0..toString();',
    '0.5.toString();',
    '1.0.toString();',
    '1.000.toString();'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, void 0, Context.OptionsNext | Context.Module | Context.Strict);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, void 0, Context.OptionsNext);
      });
    });
  }

  pass('Expressions - Member (pass)', [
    [
      'abc.package',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: {
                type: 'Identifier',
                name: 'abc'
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'package'
              }
            }
          }
        ]
      }
    ],
    [
      'abc.package',
      Context.Module | Context.Strict,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: {
                type: 'Identifier',
                name: 'abc'
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'package'
              }
            }
          }
        ]
      }
    ],
    [
      'x[a, b]',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: {
                type: 'Identifier',
                name: 'x',
                start: 0,
                end: 1
              },
              computed: true,
              property: {
                type: 'SequenceExpression',
                expressions: [
                  {
                    type: 'Identifier',
                    name: 'a',
                    start: 2,
                    end: 3
                  },
                  {
                    type: 'Identifier',
                    name: 'b',
                    start: 5,
                    end: 6
                  }
                ],
                start: 2,
                end: 6
              },
              start: 0,
              end: 7
            },
            start: 0,
            end: 7
          }
        ],
        start: 0,
        end: 7
      }
    ],
    [
      '(2[x,x],x)>x',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'SequenceExpression',
                expressions: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'Literal',
                      value: 2,
                      start: 1,
                      end: 2
                    },
                    computed: true,
                    property: {
                      type: 'SequenceExpression',
                      expressions: [
                        {
                          type: 'Identifier',
                          name: 'x',
                          start: 3,
                          end: 4
                        },
                        {
                          type: 'Identifier',
                          name: 'x',
                          start: 5,
                          end: 6
                        }
                      ],
                      start: 3,
                      end: 6
                    },
                    start: 1,
                    end: 7
                  },
                  {
                    type: 'Identifier',
                    name: 'x',
                    start: 8,
                    end: 9
                  }
                ],
                start: 1,
                end: 9
              },
              right: {
                type: 'Identifier',
                name: 'x',
                start: 11,
                end: 12
              },
              operator: '>',
              start: 0,
              end: 12
            },
            start: 0,
            end: 12
          }
        ],
        start: 0,
        end: 12
      }
    ],
    [
      'foo.bar',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: {
                type: 'Identifier',
                name: 'foo'
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'bar'
              }
            }
          }
        ]
      }
    ],
    [
      '(a[b]||(c[d]=e))',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 16,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 16,
            expression: {
              type: 'LogicalExpression',
              start: 1,
              end: 15,
              left: {
                type: 'MemberExpression',
                start: 1,
                end: 5,
                object: {
                  type: 'Identifier',
                  start: 1,
                  end: 2,
                  name: 'a'
                },
                property: {
                  type: 'Identifier',
                  start: 3,
                  end: 4,
                  name: 'b'
                },
                computed: true
              },
              operator: '||',
              right: {
                type: 'AssignmentExpression',
                start: 8,
                end: 14,
                operator: '=',
                left: {
                  type: 'MemberExpression',
                  start: 8,
                  end: 12,
                  object: {
                    type: 'Identifier',
                    start: 8,
                    end: 9,
                    name: 'c'
                  },
                  property: {
                    type: 'Identifier',
                    start: 10,
                    end: 11,
                    name: 'd'
                  },
                  computed: true
                },
                right: {
                  type: 'Identifier',
                  start: 13,
                  end: 14,
                  name: 'e'
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a&&(b=c)&&(d=e)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LogicalExpression',
              left: {
                type: 'LogicalExpression',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'c'
                  }
                },
                operator: '&&'
              },
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'd'
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'e'
                }
              },
              operator: '&&'
            }
          }
        ]
      }
    ],
    [
      'a.$._.B0',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 8,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 8,
            expression: {
              type: 'MemberExpression',
              start: 0,
              end: 8,
              object: {
                type: 'MemberExpression',
                start: 0,
                end: 5,
                object: {
                  type: 'MemberExpression',
                  start: 0,
                  end: 3,
                  object: {
                    type: 'Identifier',
                    start: 0,
                    end: 1,
                    name: 'a'
                  },
                  property: {
                    type: 'Identifier',
                    start: 2,
                    end: 3,
                    name: '$'
                  },
                  computed: false
                },
                property: {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  name: '_'
                },
                computed: false
              },
              property: {
                type: 'Identifier',
                start: 6,
                end: 8,
                name: 'B0'
              },
              computed: false
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a.if',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: {
                type: 'Identifier',
                name: 'a'
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'if'
              }
            }
          }
        ]
      }
    ],
    [
      'a().b',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 5,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 5,
            expression: {
              type: 'MemberExpression',
              start: 0,
              end: 5,
              object: {
                type: 'CallExpression',
                start: 0,
                end: 3,
                callee: {
                  type: 'Identifier',
                  start: 0,
                  end: 1,
                  name: 'a'
                },
                arguments: []
              },
              property: {
                type: 'Identifier',
                start: 4,
                end: 5,
                name: 'b'
              },
              computed: false
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'x.y / z',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'x'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'y'
                }
              },
              right: {
                type: 'Identifier',
                name: 'z'
              },
              operator: '/'
            }
          }
        ]
      }
    ],
    [
      'a[b, c]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: {
                type: 'Identifier',
                name: 'a'
              },
              computed: true,
              property: {
                type: 'SequenceExpression',
                expressions: [
                  {
                    type: 'Identifier',
                    name: 'b'
                  },
                  {
                    type: 'Identifier',
                    name: 'c'
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'a[b]||(c[d]=e)',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 14,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 14,
            expression: {
              type: 'LogicalExpression',
              start: 0,
              end: 14,
              left: {
                type: 'MemberExpression',
                start: 0,
                end: 4,
                object: {
                  type: 'Identifier',
                  start: 0,
                  end: 1,
                  name: 'a'
                },
                property: {
                  type: 'Identifier',
                  start: 2,
                  end: 3,
                  name: 'b'
                },
                computed: true
              },
              operator: '||',
              right: {
                type: 'AssignmentExpression',
                start: 7,
                end: 13,
                operator: '=',
                left: {
                  type: 'MemberExpression',
                  start: 7,
                  end: 11,
                  object: {
                    type: 'Identifier',
                    start: 7,
                    end: 8,
                    name: 'c'
                  },
                  property: {
                    type: 'Identifier',
                    start: 9,
                    end: 10,
                    name: 'd'
                  },
                  computed: true
                },
                right: {
                  type: 'Identifier',
                  start: 12,
                  end: 13,
                  name: 'e'
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a&&(b=c)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LogicalExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'b'
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'c'
                }
              },
              operator: '&&'
            }
          }
        ]
      }
    ]
  ]);
});
