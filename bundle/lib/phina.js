/*
 *
 */


;(function() {
  /**
   * @class global.Object
   * Objectの拡張
   */

  
  /**
   * @method property
   * 変数を追加
   * @param   {String} key name
   * @param   {Object} param
   */
  Object.defineProperty(Object.prototype, "property", {
    value: function(name, val) {
      Object.defineProperty(this, name, {
        value: val,
        enumerable: true,
        writable: true
      });
    }
  });

  /**
   * @method method
   * 関数を追加
   * @param   {String} key name
   * @param   {Function} function
   */
  Object.defineProperty(Object.prototype, "method", {
    value: function(name, fn) {
      Object.defineProperty(this, name, {
        value: fn,
        enumerable: false,
        writable: true
      });
    }
  });



  /**
   * @method setter
   * セッターを定義する
   */
  Object.prototype.method("setter", function(name, fn){
    Object.defineProperty(this, name, {
      set: fn,
      enumerable: false,
      configurable: true,
    });
  });

  /**
   * @method getter
   * ゲッターを定義する
   */
  Object.prototype.method("getter", function(name, fn){
    Object.defineProperty(this, name, {
      get: fn,
      enumerable: false,
      configurable: true,
    });
  });

  /**
   * @method accessor
   * アクセッサ(セッター/ゲッター)を定義する
   */
  Object.prototype.method("accessor", function(name, param) {
    Object.defineProperty(this, name, {
      set: param["set"],
      get: param["get"],
      enumerable: false,
      configurable: true,
    });
  });


  /**
   * @method forIn
   * オブジェクト用ループ処理
   */
  Object.prototype.method("forIn", function(fn, self) {
    self = self || this;

    Object.keys(this).forEach(function(key, index) {
      var value = this[key];

      fn.call(self, key, value, index);
    }, this);

    return this;
  });


  /**
   * @method  $has
   * そのプロパティを持っているかを判定する
   */
  Object.prototype.method("$has", function(key) {
    return this.hasOwnProperty(key);
  });

  /**
   * @method  $extend
   * 他のライブラリと競合しちゃうので extend -> $extend としました
   */
  Object.prototype.method("$extend", function() {
    Array.prototype.forEach.call(arguments, function(source) {
      for (var property in source) {
        this[property] = source[property];
      }
    }, this);
    return this;
  });


  /**
   * @method  $safe
   * 安全拡張
   * 上書きしない
   */
  Object.prototype.method("$safe", function(source) {
    Array.prototype.forEach.call(arguments, function(source) {
      for (var property in source) {
        if (this[property] === undefined) this[property] = source[property];
      }
    }, this);
    return this;
  });
  
  
  /**
   * @method  $strict
   * 厳格拡張
   * すでにあった場合は警告
   */
  Object.prototype.method("$strict", function(source) {
    Array.prototype.forEach.call(arguments, function(source) {
      for (var property in source) {
        console.assert(!this[property], "tm error: {0} is Already".format(property));
        this[property] = source[property];
      }
    }, this);
    return this;
  });

  /**
   * @method  $pick
   * ピック
   */
  Object.prototype.method("$pick", function() {
    var temp = {};

    Array.prototype.forEach.call(arguments, function(key) {
      if (key in this) temp[key] = this[key];
    }, this);

    return temp;
  });

  /**
   * @method  $omit
   * オミット
   */
  Object.prototype.method("$omit", function() {
    var temp = {};

    for (var key in this) {
      if (Array.prototype.indexOf.call(arguments, key) == -1) {
        temp[key] = this[key];
      }
    }

    return temp;
  });

  if (!Object.observe) {
    Object.method('observe', function(obj, callback) {
      var keys = Object.keys(obj);
      keys.forEach(function(key) {
        var tempKey = '__' + key;
        var tempValue = obj[key];
        obj[tempKey] = tempValue;
        
        obj.accessor(key, {
          get: function() {
            return this[tempKey];
          },
          set: function(v) {
            this[tempKey] = v;
            callback();
          },
        });
      });
    });
  }

  if (!Object.unobserve) {
    Object.method('unobserve', function(obj, callback) {
      console.assert(false);
    });
  }

})();



/*
 *
 */


;(function() {
  /**
   * @class global.Number
   * Numberの拡張
   */

  /**
   * @method  times
   * 数値分繰り返す
   */
  Number.prototype.method("times",  function(fn, self) {
    self = self || this;
    for (var i=0; i<this; ++i) {
      fn.call(self, i);
    }
    return this;
  });

})();


/*
 *
 */


;(function() {
  /**
   * @class global.String
   * Stringの拡張
   * `String` is a global object that may be used to construct String instances.
   */

  /**
   * @method  format
   * フォーマット
   * ## example
   *      document.write("{0} + {1} = {2}".format(5, 10, 5+10));   // "5 + 10 = 15"
   *      document.write("rgb({r}, {g}, {b})".format({             // "rgb(128, 0, 255)"
   *          r: 128,
   *          g: 0,
   *          b: 255
   *      }));
   */
  String.prototype.method("format", function(arg) {
    // 置換ファンク
    var rep_fn = undefined;
    
    // オブジェクトの場合
    if (typeof arg == "object") {
      /** @ignore */
      rep_fn = function(m, k) {
        if (arg[k] === undefined) {
          return '';
        }
        else {
          return arg[k];
        }
      }
    }
    // 複数引数だった場合
    else {
      var args = arguments;
      /** @ignore */
      rep_fn = function(m, k) { return args[ parseInt(k) ]; }
    }
    
    return this.replace( /\{(\w+)\}/g, rep_fn );
  });


  /**
   * @method  trim
   * トリム
   * ## example
   *      "  Hello, world!  ".trim(); // "Hello, world!"
   * <a href="http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/">Reference</a>
   * 
   */
  String.prototype.method("trim", function() {
    return this.replace(/^\s+|\s+$/g, "");
  });
  
  /**
   * @method  capitalize
   * キャピタライズ
   * 
   * ## example
   *      "i am a pen.".capitalize(); // "I Am A Pen."
   * 
   * ## Reference
   * 
   * - [キャピタライズ(単語の先頭の大文字化)を行う - oct inaodu](http://d.hatena.ne.jp/brazil/20051212/1134369083)
   * - [デザインとプログラムの狭間で: javascriptでキャピタライズ（一文字目を大文字にする）](http://design-program.blogspot.com/2011/02/javascript.html)
   * 
   */
  String.prototype.method("capitalize", function() {
    return this.replace(/\w+/g, function(word){
      return word.capitalizeFirstLetter();
    });
  });
  
  /**
   * @method  capitalizeFirstLetter
   * 先頭文字のみキャピタライズ
   */
  String.prototype.method("capitalizeFirstLetter", function() {
    return this.charAt(0).toUpperCase() + this.substr(1).toLowerCase();
  });
  
  /**
   * @method  toDash
   * ダッシュ
   */
  String.prototype.method("toDash", function() {
    return this.replace(/([A-Z])/g, function(m){ return '-'+m.toLowerCase(); });
  });
  
  
  /**
   * @method toHash
   * ハッシュ値に変換
   */
  String.prototype.method("toHash", function() {
    return this.toCRC32();
  });
  
  /**
   * @method  padding
   * 左側に指定された文字を詰めて右寄せにする
   */
  String.prototype.method("padding", function(n, ch) {
    var str = this.toString();
    n  = n-str.length;
    ch = ch || ' ';
    
    while(n-- > 0) { str = ch + str; }
    
    return str;
  });
  
  /**
   * @method  paddingLeft
   * 左側に指定された文字を詰めて右寄せにする
   */
  String.prototype.method("paddingLeft", function(n, ch) {
    var str = this.toString();
    n  = n-str.length;
    ch = ch || ' ';
    
    while(n-- > 0) { str = ch + str; }
    
    return str;
  });
  
  /**
   * @method  paddingRight
   * 右側に指定された文字を詰めて左寄せにする
   */
  String.prototype.method("paddingRight", function(n, ch) {
    var str = this.toString();
    n  = n-str.length;
    ch = ch || ' ';
    
    while(n-- > 0) { str = str + ch; }
    
    return str;
  });
  
  /**
   * @method  quotemeta
   * メタ文字をクォート
   */
  String.prototype.method("quotemeta", function(n) {
    return this.replace(/([^0-9A-Za-z_])/g, '\\$1');
  });
  
  /**
   * @method  repeat
   * リピート
   */
  String.prototype.method("repeat", function(n) {
    // TODO: 確認する
    var arr = Array(n);
    for (var i=0; i<n; ++i) arr[i] = this;
    return arr.join('');
  });
  
  /**
   * @method  count
   * その文字が入ってる数をカウント
   */
  String.prototype.method("count", function(str) {
    var re = new RegExp(str, 'gm');
    return this.match(re).length;
  });
  
  /**
   * @method  include
   * 含んでいるかを返す
   * ruby のやつ
   */
  String.prototype.method("include", function(str) {
    return this.indexOf(str) != -1;
  });
  
  /**
   * @method  toString
   * 配列に変換
   */
  String.prototype.method("toArray", function() {
    var arr = [];
    for (var i=0,len=this.length; i<len; ++i) {
      arr.push(this[i]);
    }
    return arr;
  });
  
  String.prototype.method("toObject", function(sep, eq) {
    sep = sep || '&';
    eq  = eq || '=';

    var obj = {};
    var params = this.split(sep);
    params.each(function(str, i) {
      var pos = str.indexOf(eq);
      if (pos > 0) {
        var key = str.substring(0, pos);
        var val = str.substring(pos+1);
        var num = Number(val);

        if (!isNaN(num)) {
          val = num;
        }
        else if (val === 'true') {
          val = true;
        }
        else if (val === 'false') {
          val = false;
        }

        obj[key] = val;
      }
    });

    return obj;
  });
  
  var table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D".split(' ');
  
  /**
   * @method  toCRC32
   * CRC32 変換
   */
  String.prototype.method("toCRC32", function() {
    var crc = 0, x=0, y=0;
    
    crc = crc ^ (-1);
    for (var i=0, iTop=this.length; i<iTop; ++i) {
      y = (crc ^ this.charCodeAt(i)) & 0xff;
      x = "0x" + table[y];
      crc = (crc >>> 8) ^ x;
    }
    
    return (crc ^ (-1)) >>> 0;
  });

})();



;(function() {

  /**
   * @property    first
   * 最初の要素
   */
  Array.prototype.accessor("first", {
      "get": function()   { return this[0]; },
      "set": function(v)  { this[0] = v; }
  });
  
  /**
   * @property    last
   * 最後の要素
   */
  Array.prototype.accessor("last", {
    "get": function()   { return this[this.length-1]; },
    "set": function(v)  { this[this.length-1] = v; }
  });

  /**
   * @method  equals
   * 渡された配列と等しいかどうかをチェック
   */
  Array.prototype.method("equals", function(arr) {
    // 長さチェック
    if (this.length !== arr.length) return false;
    
    for (var i=0,len=this.length; i<len; ++i) {
      if (this[i] !== arr[i]) {
        return false;
      }
    }

    return true;
  });

  /**
   * @method  deepEquals
   * ネストされている配列含め渡された配列と等しいかどうかをチェック
   * equalsDeep にするか検討. (Java では deepEquals なのでとりあえず合わせとく)
   */
  Array.prototype.method("deepEquals", function(arr) {
    // 長さチェック
    if (this.length !== arr.length) return false;
    
    for (var i=0,len=this.length; i<len; ++i) {
      var result = (this[i].deepEquals) ? this[i].deepEquals(arr[i]) : (this[i] === arr[i]);
      if (result === false) {
        return false;
      }
    }
    return true;
  });

  /**
   * @method    contains
   * 要素が含まれいるかをチェック
   */
  Array.prototype.method("contains", function(item, fromIndex) {
    return this.indexOf(item, fromIndex) != -1;
  });
  
  /**
   * @method  at
   * ループ添字アクセス(Ruby っぽいやつ)
   */
  Array.prototype.method("at", function(i) {
    i%=this.length;
    i+=this.length;
    i%=this.length;
    return this[i];
  });


  Array.prototype.method("find", function(fn, self) {
    var target = null;

    this.some(function(elm, i) {
      if (fn.call(self, elm, i, this)) {
        target = elm;
        return true;
      }
    });

    return target;
  });

  Array.prototype.method("findIndex", function(fn, self) {
    var target = null;

    this.some(function(elm, i) {
      if (fn.call(self, elm, i, this)) {
        target = i;
        return true;
      }
    });

    return target;
  });
  
  /**
   * @method  swap
   * a番目 と b番目 を入れ替える
   */
  Array.prototype.method("swap", function(a, b) {
    var temp = this[a];
    this[a] = this[b];
    this[b] = temp;
    
    return this;
  });

  /**
   * @method  erase
   * elm と一致する要素を削除
   * イレース
   */
  Array.prototype.method("erase", function(elm) {
    var index  = this.indexOf(elm);
    if (index >= 0) {
      this.splice(index, 1);
    }
    return this;
  });
  
  /**
   * @method  eraseAll
   * elm と一致する要素を全て削除
   */
  Array.prototype.method("eraseAll", function(elm) {
    for (var i=0,len=this.length; i<len; ++i) {
      if (this[i] == elm) {
        this.splice(i--, 1);
      }
    }
    return this;
  });
  
  /**
   * @method  eraseIf
   * 条件にマッチした要素を削除
   */
  Array.prototype.method("eraseIf", function(fn) {
    for (var i=0,len=this.length; i<len; ++i) {
      if ( fn(this[i], i, this) ) {
        this.splice(i, 1);
        break;
      }
    }
    return this;
  });
  
  /**
   * @method  eraseIfAll
   * 条件にマッチした要素を削除
   */
  Array.prototype.method("eraseIfAll", function(fn) {
    for (var i=0,len=this.length; i<len; ++i) {
      if ( fn(this[i], i, this) ) {
        this.splice(i--, 1);
        len--;
      }
    }
    return this;
  });
  
  /**
   * @method  random
   * 要素の中からランダムで取り出す
   */
  Array.prototype.method("random", function(min, max) {
    min = min || 0;
    max = max || this.length-1;
    return this[ Math.rand(min, max) ];
  });
  
  /**
   * @method  pickup
   * 要素の中からランダムで取り出す
   */
  Array.prototype.method("pickup", function(min, max) {
    min = min || 0;
    max = max || this.length-1;
    return this[ Math.rand(min, max) ];
  });
  
  /**
   * @method  pickup
   * 要素の中からランダムで取り出す
   */
  Array.prototype.method("lot", function(min, max) {
    min = min || 0;
    max = max || this.length-1;
    return this[ Math.rand(min, max) ];
  });
  
  /**
   * @method  uniq
   * 重複削除
   */
  Array.prototype.method("uniq", function(deep) {
    return this.filter(function(value, index, self) {
      return self.indexOf(value) === index;
    });
  });
  

  /**
   * @method  flatten
   * フラット.
   * Ruby のやつ.
   */
  Array.prototype.method("flatten", function(level) {
    var arr = null;

    if (level) {
      arr = this;
      for (var i=0; i<level; ++i) {
        arr = Array.prototype.concat.apply([], arr);
      }
    }
    else {
      // 完全フラット
      arr = this.reduce(function (previousValue, curentValue) {
        return Array.isArray(curentValue) ?
          previousValue.concat(curentValue.flatten()) : previousValue.concat(curentValue);
      }, []);
    }

    return arr;
  });

  /**
   * @method  clone
   * 配列をクローン
   */
  Array.prototype.method("clone", function(deep) {
    if (deep === true) {
      var a = Array(this.length);
      for (var i=0,len=this.length; i<len; ++i) {
        a[i] = (this[i].clone) ? this[i].clone(deep) : this[i];
      }
      return a;
    }
    else {
      return Array.prototype.slice.apply(this);
    }
  });


  /**
   * @method  clear
   * クリア
   */
  Array.prototype.method("clear", function() {
    this.length = 0;
    return this;
  });
  
  /**
   * @method  fill
   * 特定の値で満たす
   */
  Array.prototype.method("fill", function(value, start, end) {
    start = start || 0;
    end   = end   || (this.length);
    
    for (var i=start; i<end; ++i) {
      this[i] = value;
    }
    
    return this;
  });
  

  /**
   * @method  range
   * python のやつ
   */
  Array.prototype.method("range", function(start, end, step) {
    this.clear();
    
    if (arguments.length == 1) {
      for (var i=0; i<start; ++i) this[i] = i;
    }
    else if (start < end){
      step  = step || 1;
      for (var i=start, index=0; i<end; i+=step, ++index) {
        this[index] = i;
      }
    }
    else {
      step  = step || -1;
      for (var i=start, index=0; i>end; i+=step, ++index) {
        this[index] = i;
      }
    }
    
    return this;
  });
  
  /**
   * @method  shuffle
   * シャッフル
   */
  Array.prototype.method("shuffle", function() {
    for (var i=0,len=this.length; i<len; ++i) {
      var j = Math.rand(0, len-1);
      
      if (i != j) {
        this.swap(i, j);
      }
    }
    
    return this;
  });

  /**
   * @method  sum
   * 合計
   */
  Array.prototype.method("sum", function() {
    var sum = 0;
    for (var i=0,len=this.length; i<len; ++i) {
      sum += this[i];
    }
    return sum;
  });

  /**
   * @method  average
   * 平均
   */
  Array.prototype.method("average", function() {
    var sum = 0;
    var len = this.length;
    for (var i=0; i<len; ++i) {
      sum += this[i];
    }
    return sum/len;
  });

  /**
   * @method  each
   * 繰り返し
   * チェーンメソッド対応
   */
  Array.prototype.method("each", function() {
    this.forEach.apply(this, arguments);
    return this;
  });

  
  /**
   * @method  toULElement
   * ULElement に変換
   */
  Array.prototype.method("toULElement", function(){
      // TODO: 
  });

  /**
   * @method  toOLElement
   * OLElement に変換
   */
  Array.prototype.method("toOLElement", function(){
      // TODO:
  });

  
  /**
   * @static
   * @method  range
   * range
   */
  Array.method("range", function(start, end, step) {
    return Array.prototype.range.apply([], arguments);
  });


  /**
   * @method of
   * of関数 可変長引数をとってArrayにして返す
   * @example:
   * Array.of('a', 'b', 'c'); // ['a', 'b', 'c']
   * ES6準拠
   */
  Array.method("of", function() {
    return Array.prototype.slice.call(arguments);
  });

  /**
   * @method from
   * from関数 Array like objectに対してArrayのメソッドを追加する
   * @example:
   *
   * 1.
   * function array () {
   *   return Array.from(arguments);
   * }
   *
   * array(1,2,3); // [1, 2, 3];
   *
   * 2.
   * Array.from(document.body).forEach(function(item) {
   *    return item;
   * });
   *
   * ES6準拠
   */
  Array.method("from", function(arrayLike, callback, context) {
    if (!Object(arrayLike).length) return [];

    return Array.prototype.map.call(arrayLike, typeof callback == 'function' ? callback : function(item) {
      return item;
    }, context);
  });

})();


/*
 * math.js
 */

;(function() {
    
  /**
   * @class global.Math
   * Mathの拡張
   */

  
  /**
   * @property    DEG_TO_RAD
   * Degree to Radian.
   */
  Math.DEG_TO_RAD = Math.PI/180;
  
  /**
   * @property    RAD_TO_DEG
   * Radian to Degree.
   */
  Math.RAD_TO_DEG = 180/Math.PI;
  
  /**
   * @property    PHI
   * golden ratio
   */
  Math.PHI = (1 + Math.sqrt(5)) / 2;
  
  /**
   * @method
   * Degree を Radian に変換
   */
  Math.degToRad = function(deg) {
    return deg * Math.DEG_TO_RAD;
  };
  
  /**
   * @method
   * Radian を Degree に変換
   */
  Math.radToDeg = function(rad) {
    return rad * Math.RAD_TO_DEG;
  };
  

  
  /**
   * @method clamp
   * クランプ
   */
  Math.method("clamp", function(value, min, max) {
    return (value < min) ? min : ( (value > max) ? max : value );
  });
  
  /**
   * @method inside
   * min <= value <= max のとき true を返す
   */
  Math.method("inside", function(value, min, max) {
    return (value >= min) && (value) <= max;
  });
  
  /**
   * @method rand
   * ランダムな値を指定された範囲内で生成
   */
  Math.method("rand", function(min, max) {
    return window.Math.floor( Math.random()*(max-min+1) ) + min;
  });
  
  /**
   * @method randf
   * ランダムな値を指定された範囲内で生成
   */
  Math.method("randf", function(min, max) {
    return window.Math.random()*(max-min)+min;
  });
    
})();
/*
 *
 */



/*
 * tm namespace
 */
var phina = phina || {};

;(function() {

  phina.method('isNode', function() {
    return (typeof module !== 'undefined');
  });

  phina.method('namespace', function(fn) {
    fn.call(this);
  });

  var ns = phina.isNode() ? global : window;

  /*
   * global
   */
  phina.accessor('global', {
    get: function() {
      return ns;
    },
  });

  /**
   * mobile かどうかをチェック
   */
  phina.method('isMobile', function() {
    if (!phina.global.navigator) return false;
    var ua = phina.global.navigator.userAgent;
    return (ua.indexOf("iPhone") > 0 || ua.indexOf("iPad") > 0 || ua.indexOf("Android") > 0);
  });


  // support node.js
  if (phina.isNode()) {
    module.exports = phina;
  }

  ns.phina = phina;

})(this);


phina.namespace(function() {

  /**
   * @member phina
   * @static
   * @method createClass
   * クラスを生成
   */
  phina.method('createClass', function(params) {
    var props = {};

    var _class = function() {
      var instance = new _class.prototype._creator();
      _class.prototype.init.apply(instance, arguments);
      return instance;
    };

    if (params.superClass) {
      _class.prototype = Object.create(params.superClass.prototype);
      params.init.owner = _class;
      _class.prototype.superInit = function() {
        var caller = this.superInit.caller;
        var subclass = caller.owner;
        var superclass = subclass.prototype.superClass;
        var superInit = superclass.prototype.init;

        superInit.apply(this, arguments);
      };
      _class.prototype.constructor = _class;
    }

    _class.prototype.$extend(params);
    _class.prototype.selfClass = _class;

    // accessor
    if (params._accessor) {
      _class.prototype = Object.create(_class.prototype, params._accessor);
    }

    _class.prototype._creator = function() { return this; };
    _class.prototype._creator.prototype = _class.prototype;

    // static method
    if (params._static) {
      _class.$extend(params._static);
    }

    return _class;
  });

  var chachedClasses = {};
  /*
   * 
   */
  phina.method('using', function(path) {
    if (!path) {
      return phina.global;
    }
    
    var pathes = path.split(/[,.\/ ]|::/);
    var current = phina.global;

    pathes.forEach(function(p) {
      current = current[p] || (current[p]={});
    });

    return current;
  });
  
  /*
   * 
   */
  phina.method('register', function(path, _class) {
    var pathes = path.split(/[,.\/ ]|::/);
    var className = pathes.last;
    var parentPath = path.substring(0, path.lastIndexOf('.'));
    var parent = phina.using(parentPath);

    parent[className] = _class;

    return _class;
  });
  
  var _classDefinedCallback = {};

  /**
   * @member phina
   * @static
   * @method define
   * クラスを定義
   */
  phina.method('define', function(path, params) {
    if (params.superClass) {
      if (typeof params.superClass === 'string') {
        var _superClass = phina.using(params.superClass);
        if (typeof _superClass != 'function') {
          if (_classDefinedCallback[params.superClass] == null) {
            _classDefinedCallback[params.superClass] = [];
          }
          _classDefinedCallback[params.superClass].push(function() {
            phina.define(path, params);
          });

          return ;
        }
        else {
          params.superClass = _superClass;
        }
      }
      else {
        params.superClass = params.superClass;
      }
    }

    var _class = phina.createClass(params);
    _class.prototype.accessor('className', {
      get: function() {
        return path;
      },
    });

    phina.register(path, _class);
    
    if (_classDefinedCallback[path]) {
      _classDefinedCallback[path].forEach(function(callback) {
        callback();
      });
      _classDefinedCallback[path] = null;
    }

    return _class;
  });


  phina.method('globalize', function() {
    phina.forIn(function(key, value) {
      var ns = key;

      value.forIn(function(key, value) {
        // if (phina.global[key]) {
        //   console.log(ns, key);
        //   phina.global['_' + key] = value;
        // }
        // else {
        //   phina.global[key] = value;
        // }
        phina.global[key] = value;
      });
    });
  });

  phina._mainListeners = [];
  phina._mainLoaded = false;
  phina.method('main', function(func) {
    if (phina._mainLoaded) {
      func();
    }
    else {
      phina._mainListeners.push(func);
    }
  });

  if (phina.global.addEventListener) {
    phina.global.addEventListener('load', function() {

      phina._mainListeners.each(function(func) {
        func();
      });
      phina._mainListeners.clear();

      phina._mainLoaded = true;
    });
  }
  else {
    phina._mainLoaded = true;
  }



});









phina.namespace(function() {

  /**
   * @class phina.geom.Vector2
   * ベクトルクラス
   */
  phina.define('phina.geom.Vector2', {

    init: function(x, y) {
      this.x = x;
      this.y = y;
    },

    clone: function() {
      return phina.geom.Vector2(this.x, this.y);
    },

    equals: function(v) {
      return (this.x === v.x && this.y === v.y);
    },

    set: function(x, y) {
      this.x = x;
      this.y = y;
      return this;
    },

    /**
     * 加算
     */
    add: function(v) {
      this.x += v.x;
      this.y += v.y;
      return this;
    },

    /**
     * 減算
     */
    sub: function(v) {
      this.x -= v.x;
      this.y -= v.y;
      return this;
    },

    /**
     * 乗算
     */
    mul: function(n) {
      this.x *= n;
      this.y *= n;
      return this;
    },

    /**
     * 除算
     */
    div: function(n) {
      //console.assert(n != 0, "0 division!!");
      n = n || 0.01;
      this.x /= n;
      this.y /= n;
      return this;
    },

    /**
     * 反転
     */
    negate: function() {
      this.x = -this.x;
      this.y = -this.y;
      
      return this;
    },

    /**
     * @method
     * 内積.
     * 投影ベクトルを求めたり, 類似度に使ったり.
     */
    dot: function(v) {
      return this.x * v.x + this.y * v.y;
    },

    /**
     * @method
     * 外積
     */
    cross: function(v) {
      return (this.x*v.y) - (this.y*v.x);
    },

    /**
     * 長さを取得
     * ### memo
     * magnitude って名前の方が良いかも. 検討中.
     */
    length: function() {
      return Math.sqrt(this.x*this.x + this.y*this.y);
    },
    
    /**
     * 2乗された長さを取得
     * C# の名前を引用
     * or lengthSquare or lengthSqrt
     */
    lengthSquared: function() {
      return this.x*this.x + this.y*this.y;
    },
    
    /**
     * ２点間の距離を返す
     */
    distance: function(v) {
      return Math.sqrt( Math.pow(this.x-v.x, 2) + Math.pow(this.y-v.y, 2) );
    },
    
    /**
     * ２点間の距離を返す
     */
    distanceSquared: function(v) {
      return Math.pow(this.x-v.x, 2) + Math.pow(this.y-v.y, 2);
    },

    /**
     * ランダムベクトルをセット
     */
    random: function(min, max) {
      var degree = Math.randf(min || 0, max || 360);
      var rad = degree*Math.DEG_TO_RAD;

      this.x = Math.cos(rad);
      this.y = Math.sin(rad);

      return this;
    },
    
    /**
     * 正規化
     */
    normalize: function() {
      return this.div(this.length());
    },

    _accessor: {
      // x: {
      //   "get": function()   { return this._x; },
      //   "set": function(v)  { this._x = v; }
      // },
    },

    _defined: function() {
      
    },

  });

});


phina.namespace(function() {

  /**
   * @class phina.geom.Matrix33
   * マトリックスクラス
   */
  phina.define('phina.geom.Matrix33', {

    /**
     * @constructor
     * m00 m01 m02
     * m10 m11 m12
     * m20 m21 m22
     */
    init: function() {
      if (arguments.length >= 9) {
          this.set.apply(this, arguments);
      }
      else {
          this.identity();
      }
    },

    set: function(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
      this.m00 = m00; this.m01 = m01; this.m02 = m02;
      this.m10 = m10; this.m11 = m11; this.m12 = m12;
      this.m20 = m20; this.m21 = m21; this.m22 = m22;

      return this;
    },

    identity: function() {
      this.m00 = 1; this.m01 = 0; this.m02 = 0;
      this.m10 = 0; this.m11 = 1; this.m12 = 0;
      this.m20 = 0; this.m21 = 0; this.m22 = 1;
      return this;
    },

    /**
     * クローン
     */
    clone: function() {
      return phina.geom.Matrix33(
        this.m00, this.m01, this.m02,
        this.m10, this.m11, this.m12,
        this.m20, this.m21, this.m22
      );
    },

    /**
     * 行列式
     */
    determinant: function() {
      var m00 = this.m00; var m01 = this.m01; var m02 = this.m02;
      var m10 = this.m10; var m11 = this.m11; var m12 = this.m12;
      var m20 = this.m20; var m21 = this.m21; var m22 = this.m22;
      
      return m00*m11*m22 + m10*m21*m02 + m01*m12*m20 - m02*m11*m20 - m01*m10*m22 - m12*m21*m00;
    },

    /**
     * 転置
     */
    transpose: function() {
      var swap = function(a, b) {
        var temp = this[a];
        this[a] = this[b];
        this[b] = temp;
      }.bind(this);

      swap('m01', 'm10');
      swap('m02', 'm20');
      swap('m12', 'm21');
      
      return this;
    },

    /**
     * 逆行列
     */
    invert: function() {
      var m00 = this.m00; var m01 = this.m01; var m02 = this.m02;
      var m10 = this.m10; var m11 = this.m11; var m12 = this.m12;
      var m20 = this.m20; var m21 = this.m21; var m22 = this.m22;

      var det = this.determinant();

      // |m00, m01, m02|
      // |m10, m11, m12|
      // |m20, m21, m22|
      this.m00 = (m11*m22-m12*m21)/det;
      this.m01 = (m10*m22-m12*m20)/det*-1;
      this.m02 = (m10*m21-m11*m20)/det;
      
      this.m10 = (m01*m22-m02*m21)/det*-1;
      this.m11 = (m00*m22-m02*m20)/det;
      this.m12 = (m00*m21-m01*m20)/det*-1;
      
      this.m20 = (m01*m12-m02*m11)/det;
      this.m21 = (m00*m12-m02*m10)/det*-1;
      this.m22 = (m00*m11-m01*m10)/det;
      
      this.transpose();
      
      return this;

    },

    /**
     * 掛け算
     */
    multiply: function(mat) {
        var tm = this.m;
        var om = mat.m;

        var a00 = this.m00, a01 = this.m01, a02 = this.m02;
        var a10 = this.m10, a11 = this.m11, a12 = this.m12;
        var a20 = this.m20, a21 = this.m21, a22 = this.m22;
        var b00 = mat.m00, b01 = mat.m01, b02 = mat.m02;
        var b10 = mat.m10, b11 = mat.m11, b12 = mat.m12;
        var b20 = mat.m20, b21 = mat.m21, b22 = mat.m22;

        this.m00 = a00*b00 + a01*b10 + a02*b20;
        this.m01 = a00*b01 + a01*b11 + a02*b21;
        this.m02 = a00*b02 + a01*b12 + a02*b22;

        this.m10 = a10*b00 + a11*b10 + a12*b20;
        this.m11 = a10*b01 + a11*b11 + a12*b21;
        this.m12 = a10*b02 + a11*b12 + a12*b22;

        this.m20 = a20*b00 + a21*b10 + a22*b20;
        this.m21 = a20*b01 + a21*b11 + a22*b21;
        this.m22 = a20*b02 + a21*b12 + a22*b22;
        
        return this;
    },

    /**
     * ベクトルとの掛け算
     */
    multiplyVector2: function(v) {
      var vx = this.m00*v.x + this.m01*v.y + this.m02;
      var vy = this.m10*v.x + this.m11*v.y + this.m12;
      
      return phina.geom.Vector2(vx, vy);
    },

    // 行
    getRow: function() {
      // TODO:
    },

    // 列
    getCol: function() {
      // TODO:
    },
    /**
     * 文字列化
     */
    toString: function() {
      return "|{m00}, {m01}, {m02}|\n|{m10}, {m11}, {m12}|\n|{m20}, {m21}, {m22}|".format(this);
    },

    _accessor: {
      /**
       * x
       */
      x: {
        "get": function()   { return this._x; },
        "set": function(v)  { this._x = v; }
      },
    }
    
  });


  phina.geom.Matrix33.IDENTITY = phina.geom.Matrix33().identity();

});


phina.namespace(function() {

  /**
   * @class phina.geom.Rect
   * 
   */
  phina.define('phina.geom.Rect', {

    /** x */
    x: 0,
    /** y */
    y: 0,
    /** 幅 */
    width: 32,
    /** 高さ */
    height: 32,

    init: function(x, y, width, height) {
      this.set(x, y, width, height);
    },

    set: function(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;

      return this;
    },

    moveTo: function(x, y) {
      this.x = x;
      this.y = y;
      return this;
    },

    moveBy: function(x, y) {
      this.x += x;
      this.y += y;
      return this;
    },

    setSize: function(w, h) {
      this.width = w;
      this.height = h;
      return this;
    },

    padding: function(top, right, bottom, left) {
      // css の padding に合わせて時計回りにパラメータ調整
      switch (arguments.length) {
        case 1:
          top = right = bottom = left = arguments[0];
          break;
        case 2:
          top     = bottom = arguments[0];
          right   = left   = arguments[1];
          break;
        case 3:
          top     = arguments[0];
          right   = left = arguments[1];
          bottom  = arguments[2];
          break;
      }
      
      this.x += left;
      this.y += top;
      this.width -= left+right;
      this.height-= top +bottom;
      
      return this;
    },

    contains: function(x, y) {
      return this.left <= x && x <= this.right && this.top <= y && y <= this.bottom;
    },

    clone: function() {
      return phina.geom.Rect(this.x, this.y, this.width, this.height);
    },

    toCircle: function() {
      var radius = ((this.width < this.height) ? this.width : this.height)/2;
      return phina.geom.Circle(this.centerX, this.centerY, radius);
    },

    /**
     * 配列に変換
     */
    toArray: function() {
      return [this.x, this.y, this.width, this.height];
    },

    _accessor: {
      
      /**
       * @property  left
       * left
       */
      left: {
        "get": function()   { return this.x; },
        "set": function(v)  { this.width -= v-this.x; this.x = v; }
      },
      /**
       * @property  top
       * top
       */
      top: {
        "get": function()   { return this.y; },
        "set": function(v)  { this.height -= v-this.y; this.y = v; }
      },
      /**
       * @property  right
       * right
       */
      right: {
        "get": function()   { return this.x + this.width; },
        "set": function(v)  { this.width += v-this.right; },
      },
      /**
       * @property  bottom
       * bottom
       */
      bottom: {
        "get": function()   { return this.y + this.height; },
        "set": function(v)  { this.height += v-this.bottom; },
      },
      
      /**
       * @property  centerX
       * centerX
       */
      centerX: {
        "get": function()   { return this.x + this.width/2; },
        "set": function(v)  {
          // TODO: 検討中
        },
      },
      
      /**
       * @property  centerY
       * centerY
       */
      centerY: {
        "get": function()   { return this.y + this.height/2; },
        "set": function(v)  {
          // TODO: 検討中
        },
      },
    }

  });

});


phina.namespace(function() {

  /**
   * @class phina.geom.Circle
   * 
   */
  phina.define('phina.geom.Circle', {

    /** x */
    x: 0,
    /** y */
    y: 0,
    /** 半径 */
    radius: 32,

    init: function(x, y, radius) {
      this.set(x, y, radius);
    },

    set: function(x, y, radius) {
      this.x = x;
      this.y = y;
      this.radius = radius;

      return this;
    },

    moveTo: function(x, y) {
      this.x = x;
      this.y = y;
      return this;
    },

    moveBy: function(x, y) {
      this.x += x;
      this.y += y;
      return this;
    },

    contains: function(x, y) {
      var lenX = this.x-x;
      var lenY = this.y-y;
      var lenSquared = (lenX*lenX)+(lenY*lenY);

      return lenSquared <= this.radius*this.radius;
    },

    clone: function() {
      return phina.geom.Circle(this.x, this.y, this.radius);
    },

    toRect: function() {
      var size = this.size;
      return phina.geom.Rect(this.x - this.radius, this.y - this.radius, size, size);
    },

    /**
     * 配列に変換
     */
    toArray: function() {
      return [this.x, this.y, this.radius];
    },

    _accessor: {
      
      /**
       * @property  left
       * left
       */
      left: {
        "get": function()   { return this.x - this.radius; },
        "set": function(v)  {
          // TODO: 
        }
      },
      /**
       * @property  top
       * top
       */
      top: {
        "get": function()   { return this.y - this.radius; },
        "set": function(v)  {
          // TODO: 
        }
      },
      /**
       * @property  right
       * right
       */
      right: {
        "get": function()   { return this.x + this.radius; },
        "set": function(v)  {
          // TODO: 
        }
      },
      /**
       * @property  bottom
       * bottom
       */
      bottom: {
        "get": function()   { return this.y + this.radius; },
        "set": function(v)  {
          // TODO: 
        }
      },
      
      /**
       * @property  size
       * size
       */
      size: {
        "get": function()   { return this.radius*2; },
        "set": function(v)  {
          // TODO: 検討中
        },
      },
    }

  });

});

phina.namespace(function() {

  /**
   * @class phina.util.EventDispatcher
   */
  phina.define('phina.util.EventDispatcher', {

    init: function() {
      this._listeners = {};
    },

    on: function(type, listener) {
      if (this._listeners[type] === undefined) {
        this._listeners[type] = [];
      }

      this._listeners[type].push(listener);
      return this;
    },

    off: function(type, listener) {
      var listeners = this._listeners[type];
      var index = listeners.indexOf(listener);
      if (index != -1) {
        listeners.splice(index,1);
      }
      return this;
    },

    fire: function(e) {
      e.target = this;
      var oldEventName = 'on' + e.type;
      if (this[oldEventName]) this[oldEventName](e);
      
      var listeners = this._listeners[e.type];
      if (listeners) {
        var temp = listeners.clone();
        for (var i=0,len=temp.length; i<len; ++i) {
            temp[i].call(this, e);
        }
      }
      
      return this;
    },

    flare: function(type, param) {
      var e = {type:type};
      if (param) {
        param.forIn(function(key, val) {
          e[key] = val;
        });
      }
      this.fire(e);

      return this;
    },

    one: function(type, listener) {
      var self = this;
      
      var func = function() {
        var result = listener.apply(self, arguments);
        self.off(type, func);
        return result;
      };
      
      this.on(type, func);
      
      return this;
    },

    has: function(type) {
      if (this._listeners[type] === undefined && !this["on" + type]) return false;
      return true;
    },

    clear: function(type) {
      var oldEventName = 'on' + type;
      if (this[oldEventName]) delete this[oldEventName];
      this._listeners[type] = [];
      return this;
    },
  });

});


;(function() {

  /**
   * @class phina.util.Tween
   * 
   */
  phina.define('phina.util.Tween', {
    superClass: 'phina.util.EventDispatcher',

    /**
     * @constructor
     */
    init: function(target) {
      this.superInit();

      this.time = 0;
    },

    fromTo: function(target, beginProps, finishProps, duration, easing) {
      this.target = target;
      this.beginProps = beginProps;
      this.finishProps = finishProps;
      this.duration = duration || 1000;
      this.easing = easing;

      // setup
      this.changeProps = {};
      for (var key in beginProps) {
          this.changeProps[key] = finishProps[key] - beginProps[key];
      }

      return this;
    },

    to: function(target, finishProps, duration, easing) {
      var beginProps = {};

      for (var key in finishProps) {
        beginProps[key] = target[key];
      }

      this.fromTo(target, beginProps, finishProps, duration, easing);

      return this;
    },

    from: function(target, beginProps, duration, easing) {
        var finishProps = {};

        for (var key in beginProps) {
          finishProps[key] = target[key];
          target[key] = beginProps[key];
        }

        this.fromTo(target, beginProps, finishProps, duration, easing);

        return this;
    },

    by: function(target, props, duration, easing) {
      var beginProps = {};
      var finishProps = {};

      for (var key in props) {
        beginProps[key] = target[key];
        finishProps[key] = target[key] + props[key];
      }

      this.fromTo(target, beginProps, finishProps, duration, easing);

      return this;
    },

    yoyo: function() {
      var temp = this.beginProps;
      this.beginProps = this.finishProps;
      this.finishProps = temp;
      this.changeProps.forIn(function(key, value, index) {
        this.changeProps[key] = -value;
        this.target[key] = this.beginProps[key];
      }, this);
      // TODO: easing も反転させる
      // this.easing = easing;
      return this;
    },

    gain: function(time) {
      this.seek(this.time + time);
    },
    forward: function(time) {
      this.seek(this.time + time);
    },

    backward: function(time) {
      this.seek(this.time - time);
    },

    seek: function(time) {
      this.time = Math.clamp(time, 0, this.duration);

      this.beginProps.forIn(function(key, value) {
        var v = this.easing(this.time, value, this.changeProps[key], this.duration);
        this.target[key] = v;
      }, this);

      return this;
    },

    _accessor: {
      easing: {
        get: function() {
          return this._easing;
        },
        set: function(v) {
          this._easing = phina.util.Tween.EASING[v] || phina.util.Tween.EASING.default;
        },
      },
    }
  });


  /**
   * @class tm.anim.easing
   * イージング
   * ### Reference
   * - <http://coderepos.org/share/wiki/JSTweener>
   * - <http://coderepos.org/share/browser/lang/javascript/jstweener/trunk/src/JSTweener.js>
   * - <http://gsgd.co.uk/sandbox/jquery/easing/jquery.easing.1.3.js>
   * - <http://hosted.zeh.com.br/tweener/docs/en-us/misc/transitions.html>
   */
  phina.util.Tween.EASING = {
    /** default */
    "default": function(t, b, c, d) {
      return c*t/d + b;
    },
    /** linear */
    linear: function(t, b, c, d) {
      return c*t/d + b;
    },
    /** swing */
    swing: function(t, b, c, d) {
      return -c *(t/=d)*(t-2) + b;
    },
    /** easeInQuad */
    easeInQuad: function(t, b, c, d) {
      return c*(t/=d)*t + b;
    },
    /** easeOutQuad */
    easeOutQuad: function(t, b, c, d) {
      return -c *(t/=d)*(t-2) + b;
    },
    /** easeInOutQuad */
    easeInOutQuad: function(t, b, c, d) {
      if((t/=d/2) < 1) return c/2*t*t + b;
      return -c/2 *((--t)*(t-2) - 1) + b;
    },
    /** defeInCubic */
    easeInCubic: function(t, b, c, d) {
      return c*(t/=d)*t*t + b;
    },
    /** easeOutCubic */
    easeOutCubic: function(t, b, c, d) {
      return c*((t=t/d-1)*t*t + 1) + b;
    },
    /** easeInOutCubic */
    easeInOutCubic: function(t, b, c, d) {
      if((t/=d/2) < 1) return c/2*t*t*t + b;
      return c/2*((t-=2)*t*t + 2) + b;
    },
    /** easeOutInCubic */
    easeOutInCubic: function(t, b, c, d) {
      if(t < d/2) return tm.anim.easing.easeOutCubic(t*2, b, c/2, d);
      return tm.anim.easing.easeInCubic((t*2)-d, b+c/2, c/2, d);
    },
    /** easeInQuart */
    easeInQuart: function(t, b, c, d) {
      return c*(t/=d)*t*t*t + b;
    },
    /** easeOutQuart */
    easeOutQuart: function(t, b, c, d) {
      return -c *((t=t/d-1)*t*t*t - 1) + b;
    },
    /** easeInOutQuart */
    easeInOutQuart: function(t, b, c, d) {
      if((t/=d/2) < 1) return c/2*t*t*t*t + b;
      return -c/2 *((t-=2)*t*t*t - 2) + b;
    },
    /** easeOutInQuart */
    easeOutInQuart: function(t, b, c, d) {
      if(t < d/2) return tm.anim.easing.easeOutQuart(t*2, b, c/2, d);
      return tm.anim.easing.easeInQuart((t*2)-d, b+c/2, c/2, d);
    },
    /** easeInQuint */
    easeInQuint: function(t, b, c, d) {
      return c*(t/=d)*t*t*t*t + b;
    },
    /** easeOutQuint */
    easeOutQuint: function(t, b, c, d) {
      return c*((t=t/d-1)*t*t*t*t + 1) + b;
    },
    /** easeInOutQuint */
    easeInOutQuint: function(t, b, c, d) {
      if((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
      return c/2*((t-=2)*t*t*t*t + 2) + b;
    },
    /** easeOutInQuint */
    easeOutInQuint: function(t, b, c, d) {
      if(t < d/2) return tm.anim.easing.easeOutQuint(t*2, b, c/2, d);
      return tm.anim.easing.easeInQuint((t*2)-d, b+c/2, c/2, d);
    },
    /** easeInSine */
    easeInSine: function(t, b, c, d) {
      return -c * Math.cos(t/d *(Math.PI/2)) + c + b;
    },
    /** easeOutSine */
    easeOutSine: function(t, b, c, d) {
      return c * Math.sin(t/d *(Math.PI/2)) + b;
    },
    /** easeInOutSine */
    easeInOutSine: function(t, b, c, d) {
      return -c/2 *(Math.cos(Math.PI*t/d) - 1) + b;
    },
    /** easeOutInSine */
    easeOutInSine: function(t, b, c, d) {
      if(t < d/2) return tm.anim.easing.easeOutSine(t*2, b, c/2, d);
      return tm.anim.easing.easeInSine((t*2)-d, b+c/2, c/2, d);
    },
    /** easeInExpo */
    easeInExpo: function(t, b, c, d) {
      return(t==0) ? b : c * Math.pow(2, 10 *(t/d - 1)) + b - c * 0.001;
    },
    /** easeOutExpo */
    easeOutExpo: function(t, b, c, d) {
      return(t==d) ? b+c : c * 1.001 *(-Math.pow(2, -10 * t/d) + 1) + b;
    },
    /** easeInOutExpo */
    easeInOutExpo: function(t, b, c, d) {
      if(t==0) return b;
      if(t==d) return b+c;
      if((t/=d/2) < 1) return c/2 * Math.pow(2, 10 *(t - 1)) + b - c * 0.0005;
      return c/2 * 1.0005 *(-Math.pow(2, -10 * --t) + 2) + b;
    },
    /** easeOutInExpo */
    easeOutInExpo: function(t, b, c, d) {
      if(t < d/2) return tm.anim.easing.easeOutExpo(t*2, b, c/2, d);
      return tm.anim.easing.easeInExpo((t*2)-d, b+c/2, c/2, d);
    },
    /** easeInCirc */
    easeInCirc: function(t, b, c, d) {
      return -c *(Math.sqrt(1 -(t/=d)*t) - 1) + b;
    },
    /** easeOutCirc */
    easeOutCirc: function(t, b, c, d) {
      return c * Math.sqrt(1 -(t=t/d-1)*t) + b;
    },
    /** easeInOutCirc */
    easeInOutCirc: function(t, b, c, d) {
      if((t/=d/2) < 1) return -c/2 *(Math.sqrt(1 - t*t) - 1) + b;
      return c/2 *(Math.sqrt(1 -(t-=2)*t) + 1) + b;
    },
    /** easeOutInCirc */
    easeOutInCirc: function(t, b, c, d) {
      if(t < d/2) return tm.anim.easing.easeOutCirc(t*2, b, c/2, d);
      return tm.anim.easing.easeInCirc((t*2)-d, b+c/2, c/2, d);
    },
    /** easeInElastic */
    easeInElastic: function(t, b, c, d, a, p) {
      var s;
      if(t==0) return b;  if((t/=d)==1) return b+c;  if(!p) p=d*.3;
      if(!a || a < Math.abs(c)) { a=c; s=p/4; } else s = p/(2*Math.PI) * Math.asin(c/a);
      return -(a*Math.pow(2,10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p )) + b;
    },
    /** easeOutElastic */
    easeOutElastic: function(t, b, c, d, a, p) {
      var s;
      if(t==0) return b;  if((t/=d)==1) return b+c;  if(!p) p=d*.3;
      if(!a || a < Math.abs(c)) { a=c; s=p/4; } else s = p/(2*Math.PI) * Math.asin(c/a);
      return(a*Math.pow(2,-10*t) * Math.sin((t*d-s)*(2*Math.PI)/p ) + c + b);
    },
    /** easeInOutElastic */
    easeInOutElastic: function(t, b, c, d, a, p) {
      var s;
      if(t==0) return b;  if((t/=d/2)==2) return b+c;  if(!p) p=d*(.3*1.5);
      if(!a || a < Math.abs(c)) { a=c; s=p/4; }       else s = p/(2*Math.PI) * Math.asin(c/a);
      if(t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p )) + b;
      return a*Math.pow(2,-10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    },
    /** easeOutInElastic */
    easeOutInElastic: function(t, b, c, d, a, p) {
      if(t < d/2) return tm.anim.easing.easeOutElastic(t*2, b, c/2, d, a, p);
      return tm.anim.easing.easeInElastic((t*2)-d, b+c/2, c/2, d, a, p);
    },
    /** easeInBack */
    easeInBack: function(t, b, c, d, s) {
      if(s == undefined) s = 1.70158;
      return c*(t/=d)*t*((s+1)*t - s) + b;
    },
    /** easeOutBack */
    easeOutBack: function(t, b, c, d, s) {
      if(s == undefined) s = 1.70158;
      return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },
    /** easeInOutBack */
    easeInOutBack: function(t, b, c, d, s) {
      if(s == undefined) s = 1.70158;
      if((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
      return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },
    /** easeOutInBack */
    easeOutInBack: function(t, b, c, d, s) {
      if(t < d/2) return tm.anim.easing.easeOutBack(t*2, b, c/2, d, s);
      return tm.anim.easing.easeInBack((t*2)-d, b+c/2, c/2, d, s);
    },
    /** easeInBounce */
    easeInBounce: function(t, b, c, d) {
      return c - tm.anim.easing.easeOutBounce(d-t, 0, c, d) + b;
    },
    /** easeOutBounce */
    easeOutBounce: function(t, b, c, d) {
      if((t/=d) <(1/2.75)) {
        return c*(7.5625*t*t) + b;
      } else if(t <(2/2.75)) {
        return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
      } else if(t <(2.5/2.75)) {
        return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
      } else {
        return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
      }
    },
    /** easeInOutBounce */
    easeInOutBounce: function(t, b, c, d) {
      if(t < d/2) return tm.anim.easing.easeInBounce(t*2, 0, c, d) * .5 + b;
      else return tm.anim.easing.easeOutBounce(t*2-d, 0, c, d) * .5 + c*.5 + b;
    },
    /** easeOutInBounce */
    easeOutInBounce: function(t, b, c, d) {
      if(t < d/2) return tm.anim.easing.easeOutBounce(t*2, b, c/2, d);
      return tm.anim.easing.easeInBounce((t*2)-d, b+c/2, c/2, d);
    }
  };

})();



;(function() {

  /**
   * @class phina.util.Ticker
   * tick management class
   */
  phina.define('phina.util.Ticker', {
    superClass: 'phina.util.EventDispatcher',

    /** 経過フレーム数 */
    frame: null,
    /** 1フレームの経過時間 */
    deltaTime: null,
    /** 全体の経過時間 */
    elapsedTime: null,

    /**
     * @constructor
     */
    init: function() {
      this.superInit();

      this.fps = 30;
      this.frame = 0;
      this.deltaTime = 0;
      this.elapsedTime = 0;
    },

    tick: function(func) {
      this.on('tick', func);
    },

    run: function() {
      var now = (new Date()).getTime();
      // 1フレームに掛かった時間
      this.deltaTime = now - this.currentTime;
      // 全体の経過時間
      this.elapsedTime = now - this.startTime;

      var start = this.currentTime = now;
      this.flare('tick');
      var end = (new Date()).getTime();

      // フレームを更新
      this.frame += 1;

      // calculate elapsed time
      var elapsed = end-start;

      // calculate next waiting time
      var delay = Math.max(this.frameTime-elapsed, 0);

      return delay;
    },

    start: function() {
      var self = this;

      this.startTime = this.currentTime = (new Date()).getTime();

      (function() {
        var delay = self.run();
        setTimeout(arguments.callee, delay);
      })();

      return this;
    },

    resume: function() {
      // TODO: 
    },

    stop: function() {
      // TODO: 
    },

    rewind: function() {
      // TODO: 
    },

    _accessor: {
      fps: {
        "get": function()   { return this._fps; },
        "set": function(v)  {
          this._fps = v;
          this.frameTime = 1000/this._fps;
        },
      },
    },
  });

})();

;(function() {

  /**
   * @class phina.util.Grid
   * tick management class
   */
  phina.define('phina.util.Grid', {

    /** 幅 */
    width: 640,
    /** 列数 */
    columns: 12,
    /** ループ */
    loop: false,

    /**
     * @constructor
     */
    init: function() {
      if (typeof arguments[0] === 'object') {
        var param = arguments[0];
        var width = param.width || 640;
        var columns = param.columns || 12;
        var loop = param.loop || false;
      }
      else {
        var width   = arguments[0] || 640;
        var columns = arguments[1] || 12;
        var loop    = arguments[2] || false;
      }

      this.width = width;
      this.columns = columns;
      this.loop = loop;
      this.unitWidth = this.width/this.columns;
    },

    // スパン指定で値を取得(負数もok)
    span: function(index) {
      if (this.loop) {
        index += this.columns;
        index %= this.columns;
      }
      return this.unitWidth * index;
    },

    //
    unit: function() {
      return this.unitWidth;
    },

    center: function(offset) {
      var index = offset || 0;
      return (this.width/2) + (this.unitWidth * index);
    },

  });

})();


// 監視オブジェクト
// register で key を登録 (デフォルト値も一緒に？)
// event dispatcher を継承
// event dispatcher って util じゃね？
// register で登録した値を変更したら change イベントが走る


// 名前候補
//  middleman(仲立人)


phina.namespace(function() {

  /**
   * @class phina.util.ChangeDispatcher
   */
  phina.define('phina.util.ChangeDispatcher', {
    superClass: 'phina.util.EventDispatcher',

    init: function() {
      this.superInit();

      this._observe = true;
    },

    register: function(key, defaultValue) {
      if (arguments.length === 1) {
        var obj = arguments[0];
        obj.forIn(function(key, value) {
          this.register(key, value);
        }, this);
      }
      else {
        var tempKey = '__' + key;
        this[tempKey] = defaultValue;
        this.accessor(key, {
          get: function() {
            return this[tempKey];
          },
          set: function(v) {
            this[tempKey] = v;
            if (this._observe) {
              this.flare('change');
            }
          },
        });
      }
      return this;
    },

    observe: function() {
      this._observe = true;
    },
    unobserve: function() {
      this._observe = false;
    },
  });

});

;(function() {

  /**
   * @class phina.util.Flow
   * tick management class
   */
  phina.define('phina.util.Flow', {
    superClass: 'phina.util.EventDispatcher',

    /**
     * @constructor
     */
    init: function(func, wait) {
      this.superInit();

      this.status = 'pending';
      this.resultValue = null;
      this._queue = [];
      this.func = func;

      if (wait !== true) {
        var self = this;
        var resolve = function() {
          self.resolve.apply(self, arguments);
          self.status = 'resolved';
        };
        var reject = function() {
          self.reject.apply(self, arguments);
          self.status = 'rejected';
        };

        this.func(resolve, reject);
      }
    },

    /*
     * 成功
     */
    resolve: function(arg) {
      this.resultValue = arg;

      // キューに積まれた関数を実行
      this._queue.each(function(func) {
        func(this.resultValue);
      }, this);
      this._queue.clear();
    },

    /*
     * 失敗
     */
    reject: function() {

    },

    /*
     * 非同期終了時の処理を登録
     */
    then: function(func) {
      var self = this;
      // 成功ステータスだった場合は即実行
      if (this.status === 'resolved') {
        var value = func(this.resultValue);
        return phina.util.Flow.resolve(value);
      }
      else {
        var flow = phina.util.Flow(function(resolve) {
          resolve();
        }, true);

        this._queue.push(function(arg) {
          var resultValue = func(arg);

          if (resultValue instanceof phina.util.Flow) {
            resultValue.then(function(value) {
              flow.resolve(value);
            });
          }
          else {
            flow.resolve(arg);
          }
        });

        return flow;
      }
    },

    _static: {
      resolve: function(value) {
        if (value instanceof phina.util.Flow) {
          return value;
        }
        else {
          var flow = phina.util.Flow(function(resolve) {
            resolve(value);
          });
          return flow;
        }
      },
      all: function(flows) {
        return phina.util.Flow(function(resolve) {
          var count = 0;

          var args = [];

          flows.each(function(flow) {
            flow.then(function(d) {
              ++count;
              args.push(d);

              if (count >= flows.length) {
                resolve(args);
              }
            });
          });
        });
      },
    },
  });

})();
/*
 * color.js
 */

phina.namespace(function() {

  /**
   * @class phina.util.Color
   * カラークラス
   */
  phina.define("phina.util.Color", {
    /** R値 */
    r: 255,
    /** G値 */
    g: 255,
    /** B値 */
    b: 255,
    /** A値 */
    a: 1.0,

    /**
     * 初期化
     */
    init: function(r, g, b, a) {
      this.set.apply(this, arguments);
    },

    /**
     * セッター.
     */
    set: function(r, g, b, a) {
      this.r = r;
      this.g = g;
      this.b = b;
      this.a = (a !== undefined) ? a : 1.0;
      return this;
    },

    /**
     * 数値によるセッター.
     */
    setFromNumber: function(r, g, b, a) {
      this.r = r;
      this.g = g;
      this.b = b;
      this.a = (a !== undefined) ? a : 1.0;
      return this;
    },

    /**
     * 配列によるセッター
     */
    setFromArray: function(arr) {
      return this.set.apply(this, arr);
    },

    /**
     * オブジェクトによるセッター
     */
    setFromObject: function(obj) {
      return this.set(obj.r, obj.g, obj.b, obj.a);
    },

    /**
     * 文字列によるセッター
     */
    setFromString: function(str) {
      var color = phina.util.Color.stringToNumber(str);
      return this.set(color[0], color[1], color[2], color[3]);
    },

    /**
     * 賢いセッター
     */
    setSmart: function() {
      var arg = arguments[0];
      if (arguments.length >= 3) {
        this.set(arguments.r, arguments.g, arguments.b, arguments.a);
      } else if (arg instanceof Array) {
        this.setFromArray(arg);
      } else if (arg instanceof Object) {
        this.setFromObject(arg);
      } else if (typeof(arg) == "string") {
        this.setFromString(arg);
      }
      return this;
    },

    /**
     * CSS 用 16進数文字列に変換
     */
    toStyleAsHex: function() {
      return "#{0}{1}{2}".format(
        this.r.toString(16).padding(2, '0'),
        this.g.toString(16).padding(2, '0'),
        this.b.toString(16).padding(2, '0')
      );
    },

    /**
     * CSS 用 RGB文字列に変換
     */
    toStyleAsRGB: function() {
      return "rgb({r},{g},{b})".format({
        r: ~~this.r,
        g: ~~this.g,
        b: ~~this.b
      });
    },


    /**
     * CSS 用 RGBA文字列に変換
     */
    toStyleAsRGBA: function() {
      return "rgba({r},{g},{b},{a})".format({
        r: ~~this.r,
        g: ~~this.g,
        b: ~~this.b,
        a: this.a
      });
    },

    /**
     * CSS 用 RGBA 文字列に変換
     */
    toStyle: function() {
      return "rgba({r},{g},{b},{a})".format({
        r: ~~this.r,
        g: ~~this.g,
        b: ~~this.b,
        a: this.a
      });
    },

    _static: {

      /**
       * @static
       * カラーリスト
       */
      COLOR_LIST: {
        /** @property black */
        "black": [0x00, 0x00, 0x00],
        /** @property silver */
        "silver": [0xc0, 0xc0, 0xc0],
        /** @property gray */
        "gray": [0x80, 0x80, 0x80],
        /** @property white */
        "white": [0xff, 0xff, 0xff],
        /** @property maroon */
        "maroon": [0x80, 0x00, 0x00],
        /** @property red */
        "red": [0xff, 0x00, 0x00],
        /** @property purple */
        "purple": [0x80, 0x00, 0x80],
        /** @property fuchsia */
        "fuchsia": [0xff, 0x00, 0xff],
        /** @property green */
        "green": [0x00, 0x80, 0x00],
        /** @property lime */
        "lime": [0x00, 0xff, 0x00],
        /** @property olive */
        "olive": [0x80, 0x80, 0x00],
        /** @property yellow */
        "yellow": [0xff, 0xff, 0x00],
        /** @property navy */
        "navy": [0x00, 0x00, 0x80],
        /** @property blue */
        "blue": [0x00, 0x00, 0xff],
        /** @property teal */
        "teal": [0x00, 0x80, 0x80],
        /** @property aqua */
        "aqua": [0x00, 0xff, 0xff],
      },

      /**
       * @static
       * @member phina.util.Color
       * @method strToNum
       */
      strToNum: function(str) {
        return this.stringToNumber(str);
      },
      stringToNumber: function(str) {
        var vlaue = null;
        var type = null;

        if (str[0] === '#') {
          type = (str.length == 4) ? "hex111" : "hex222";
        } else if (str[0] === 'r' && str[1] === 'g' && str[2] === 'b') {
          type = (str[3] == 'a') ? "rgba" : "rgb";
        } else if (str[0] === 'h' && str[1] === 's' && str[2] === 'l') {
          type = (str[3] == 'a') ? "hsla" : "hsl";
        }

        if (type) {
          var match_set = MATCH_SET_LIST[type];
          var m = str.match(match_set.reg);
          value = match_set.exec(m);
        } else if (phina.util.Color.COLOR_LIST[str]) {
          value = phina.util.Color.COLOR_LIST[str];
        }

        return value;
      },

      /**
       * @static
       * @method
       * hsl を rgb に変換
       */
      HSLtoRGB: function(h, s, l) {
        var r, g, b;

        h %= 360;
        h += 360;
        h %= 360;
        s *= 0.01;
        l *= 0.01;

        if (s == 0) {
          var l = Math.round(l * 255);
          return [l, l, l];
        }
        var m2 = (l < 0.5) ? l * (1 + s) : l + s - l * s;
        var m1 = l * 2 - m2;

        // red
        var temp = (h + 120) % 360;
        if (temp < 60) {
          r = m1 + (m2 - m1) * temp / 60;
        } else if (temp < 180) {
          r = m2;
        } else {
          r = m1;
        }

        // green
        temp = h;
        if (temp < 60) {
          g = m1 + (m2 - m1) * temp / 60;
        } else if (temp < 180) {
          g = m2;
        } else if (temp < 240) {
          g = m1 + (m2 - m1) * (240 - temp) / 60;
        } else {
          g = m1;
        }

        // blue
        temp = ((h - 120) + 360) % 360;
        if (temp < 60) {
          b = m1 + (m2 - m1) * temp / 60;
        } else if (temp < 180) {
          b = m2;
        } else if (temp < 240) {
          b = m1 + (m2 - m1) * (240 - temp) / 60;
        } else {
          b = m1;
        }

        return [
          parseInt(r * 255),
          parseInt(g * 255),
          parseInt(b * 255)
        ];
      },

      /**
       * @static
       * @method
       * hsla を rgba に変換
       */
      HSLAtoRGBA: function(h, s, l, a) {
        var temp = phina.util.Color.HSLtoRGB(h, s, l);
        temp[3] = a;
        return rgb;
      },

      /**
       * @static
       * @method
       * rgb 値を作成
       */
      createStyleRGB: function(r, g, b) {
        return "rgba(" + r + "," + g + "," + b + ")";
      },

      /**
       * @static
       * @method
       * rgba 値を作成
       */
      createStyleRGBA: function(r, g, b, a) {
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
      },

      /**
       * @static
       * @method
       * hsl 値を作成
       */
      createStyleHSL: function(h, s, l) {
        return "hsl(" + h + "," + s + "%," + l + "%)";
      },

      /**
       * @static
       * @method
       * hsla 値を作成
       */
      createStyleHSLA: function(h, s, l, a) {
        return "hsla(" + h + "," + s + "%," + l + "%," + a + ")";
      },
    }
  });


  var MATCH_SET_LIST = {
    "hex111": {
      reg: /^#(\w{1})(\w{1})(\w{1})$/,
      exec: function(m) {
        return [
          parseInt(m[1] + m[1], 16),
          parseInt(m[2] + m[2], 16),
          parseInt(m[3] + m[3], 16)
        ];
      }
    },
    "hex222": {
      reg: /^#(\w{2})(\w{2})(\w{2})$/,
      exec: function(m) {
        return [
          parseInt(m[1], 16),
          parseInt(m[2], 16),
          parseInt(m[3], 16)
        ];
      }
    },
    "rgb": {
      reg: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
      exec: function(m) {
        return [
          parseInt(m[1]),
          parseInt(m[2]),
          parseInt(m[3])
        ];
      }
    },
    "rgba": {
      reg: /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1}(\.{1}\d+)?)\)$/,
      exec: function(m) {
        return [
          parseInt(m[1]),
          parseInt(m[2]),
          parseInt(m[3]),
          parseFloat(m[4])
        ];
      }
    },
    "hsl": {
      reg: /^hsl\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%\)$/,
      exec: function(m) {
        return phina.util.Color.HSLtoRGB(m[1], m[2], m[3]);
      }
    },
    "hsla": {
      reg: /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1}(\.{1}\d+)?)\)$/,
      exec: function(m) {
        return phina.util.Color.HSLAtoRGBA(m[1], m[2], m[3], m[4]);
      },
    }
  };

});


phina.namespace(function() {

  /**
   * @class phina.asset.Asset
   * 
   */
  phina.define('phina.asset.Asset', {
    superClass: "phina.util.EventDispatcher",

    /**
     * @constructor
     */
    init: function(src) {
      this.superInit();

      this.loaded = false;
    },

    load: function(src) {
      this.src = src;
      return phina.util.Flow(this._load.bind(this));
    },

    isLoaded: function() {
      return this.loaded;
    },

    _load: function(resolve) {
      var self = this;
      setTimeout(function() {
        self.loaded = true;
        resolve();
      }, 100);
    },

  });

});



phina.namespace(function() {

  /**
   * @class phina.asset.AssetManager
   * 
   */
  phina.define('phina.asset.AssetManager', {
    _static: {
      assets: {
        image: {},
        sound: {},
        spritesheet: {},
      },
      
      get: function(type, key) {
        return this.assets[type] && this.assets[type][key];
      },
      set: function(type, key, asset) {
        if (!this.assets[type]) {
          this.assets[type] = {};
        }
        this.assets[type][key] = asset;
      },
      contains: function(type, key) {
        return ;
      }
    },

  });

});



phina.namespace(function() {

  /**
   * @class phina.asset.AssetManager
   * 
   */
  phina.define('phina.asset.AssetLoader', {
    superClass: "phina.util.EventDispatcher",

    /**
     * @constructor
     */
    init: function(params) {
      this.superInit();

      params = (params || {}).$safe({
        cache: true,
      });

      this.assets = {};
      this.cache = params.cache;
    },

    load: function(params) {
      var self = this;
      var flows = [];

      var counter = 0;

      params.forIn(function(type, assets) {
        assets.forIn(function(key, value) {
          var func = phina.asset.AssetLoader.assetLoadFunctions[type];
          var flow = func(key, value);
          flow.then(function(asset) {
            self.flare('progress', {
              key: key,
              asset: asset,
              progress: (++counter/flows.length),
            });
            if (self.cache) {
              phina.asset.AssetManager.set(type, key, asset);
            }
          });
          flows.push(flow);
        });
      });

      return phina.util.Flow.all(flows).then(function(args) {
        self.flare('load');
      });
    },

    _static: {
      assetLoadFunctions: {
        image: function(key, path) {
          var texture = phina.asset.Texture();
          var flow = texture.load(path);
          return flow;
        },
        sound: function(key, path) {
          var sound = phina.asset.Sound();
          var flow = sound.load(path);
          return flow;
        },
        spritesheet: function(key, path) {
          var ss = phina.asset.SpriteSheet();
          var flow = ss.load(path);
          return flow;
        },
        script: function(key, path) {
          var script = phina.asset.Script();
          return script.load(path);
        },
        font: function(key, path) {
          var font = phina.asset.Font();
          font.setFontName(key);
          return font.load(path);
        },
      }
    }

  });

});



phina.namespace(function() {

  /**
   * @class phina.asset.File
   * 
   */
  phina.define('phina.asset.File', {
    superClass: "phina.asset.Asset",

    /**
     * @constructor
     */
    init: function() {
      this.superInit();
    },

    _load: function(resolve) {

      var params = {};

      if (typeof this.src === 'string') {
        params.$extend({
          path: this.src,
        });
      }
      else if (typeof this.src === 'object') {
        params.$extend(this.src);
      }

      params.$safe({
        path: '',
        dataType: 'text',
      });

      // load
      var self = this;
      var xml = new XMLHttpRequest();
      xml.open('GET', params.path);
      xml.onreadystatechange = function() {
        if (xml.readyState === 4) {
          if ([200, 201, 0].indexOf(xml.status) !== -1) {
            var data = xml.responseText;

            if (params.dataType === 'json') {
              data = JSON.parse(data);
            }

            self.data = data;
            resolve(self);
          }
        }
      };

      xml.send(null);
      // this.domElement = new Image();
      // this.domElement.src = this.src;

      // var self = this;
      // this.domElement.onload = function() {
      //   self.loaded = true;
      //   resolve(self);
      // };
    },

  });

});



phina.namespace(function() {

  /**
   * @class phina.asset.Script
   * 
   */
  phina.define('phina.asset.Script', {
    superClass: "phina.asset.Asset",

    /**
     * @constructor
     */
    init: function() {
      this.superInit();
    },

    _load: function(resolve) {
      this.domElement = document.createElement('script');
      this.domElement.src = this.src;

      this.domElement.onload = function() {
        resolve(self);
      }.bind(this);

      document.body.appendChild(this.domElement);
    },

  });

});



phina.namespace(function() {

  /**
   * @class phina.asset.Texture
   * 
   */
  phina.define('phina.asset.Texture', {
    superClass: "phina.asset.Asset",

    /**
     * @constructor
     */
    init: function() {
      this.superInit();
    },

    _load: function(resolve) {
      this.domElement = new Image();
      this.domElement.src = this.src;

      var self = this;
      this.domElement.onload = function(e) {
        self.loaded = true;
        resolve(self);
      };
      this.domElement.onerror = function(e) {
        console.error("[phina.js] not found `{0}`!".format(this.src));

        var key = self.src.split('/').last.replace('.png', '').split('?').first.split('#').first;
        e.target.src = "http://dummyimage.com/128x128/444444/eeeeee&text=" + key;
        e.target.onerror = null;
      };
    },

  });

});




phina.namespace(function() {

  /**
   * @class phina.asset.Sound
   * 
   */
  phina.define('phina.asset.Sound', {
    superClass: "phina.asset.Asset",

    /**
     * @constructor
     */
    init: function() {
      this.superInit();
      this.context = phina.asset.Sound.audioContext;
    },

    /**
     * 複製
     */
    clone: function() {
      var sound = phina.asset.Sound();
      sound.loadFromBuffer(this.buffer);
      sound.volume = this.volume;
      return sound;
    },

    play: function() {
      if (this.source) {
        // TODO: キャッシュする？
      }

      this.source = this.context.createBufferSource();
      this.source.buffer = this.buffer;
      // connect
      this.source.connect(this.context.destination);
      // play
      this.source.start(0);

      // check play end
      if (this.source.buffer) {
        var time = (this.source.buffer.duration/this.source.playbackRate.value)*1000;
        window.setTimeout(function(self) {
          self.flare('ended');
        }, time, this);
      }

      return this;
    },

    stop: function() {
      this.source.stop();
      return this;
    },

    // 試してみるなう
    _oscillator: function(type) {
      var context = this.context;

      var oscillator = context.createOscillator();

      // Sine wave is type = “sine”
      // Square wave is type = “square”
      // Sawtooth wave is type = “saw”
      // Triangle wave is type = “triangle”
      // Custom wave is type = “custom” 
      oscillator.type = type || 'sine';

      this.source = oscillator;
      // connect
      this.source.connect(context.destination);
    },

    loadFromBuffer: function(buffer) {
      var context = this.context;

      // set default buffer
      if (!buffer) {
        buffer = context.createBuffer( 1, 44100, 44100 );
        var channel = buffer.getChannelData(0);

        for( var i=0; i < channel.length; i++ )
        {
          channel[i] = Math.sin( i / 100 * Math.PI);
        }
      }

      // source
      this.buffer = buffer;
    },

    _load: function(r) {
      var self = this;

      var xml = new XMLHttpRequest();
      xml.open('GET', this.src);
      xml.onreadystatechange = function() {
        if (xml.readyState === 4) {
          if ([200, 201, 0].indexOf(xml.status) !== -1) {
            // 音楽バイナリーデータ
            var data = xml.response;

            // webaudio 用に変換
            self.context.decodeAudioData(data, function(buffer) {
              self.loadFromBuffer(buffer);
              r(self);
            }, function() {
              console.warn("音声ファイルのデコードに失敗しました。(" + src + ")");
              self.loaded = true;
              r(self);
            });
          }
        }
      };

      xml.responseType = 'arraybuffer';
      xml.send(null);
    },

    _static: {
      audioContext: (function() {
        if (phina.isNode()) return null;

        var g = phina.global;
        var context = null;

        if (g.AudioContext) {
            context = new AudioContext();
        }
        else if (g.webkitAudioContext) {
            context = new webkitAudioContext();
        }
        else if (g.mozAudioContext) {
            context = new mozAudioContext();
        }

        return context;
      })(),
    },

  });

});



phina.namespace(function() {

  /**
   * @class phina.asset.SpriteSheet
   * 
   */
  phina.define('phina.asset.SpriteSheet', {
    superClass: "phina.asset.Asset",

    /**
     * @constructor
     */
    init: function() {
      this.superInit();
    },

    setup: function(params) {
      this._setupFrame(params.frame);
      this._setupAnim(params.animations);
      return this;
    },

    _load: function(resolve) {

      var self = this;

      if (typeof this.src === 'string') {
        var xml = new XMLHttpRequest();
        xml.open('GET', this.src);
        xml.onreadystatechange = function() {
          if (xml.readyState === 4) {
            if ([200, 201, 0].indexOf(xml.status) !== -1) {
              var data = xml.responseText;
              var json = JSON.parse(data);

              self.setup(json);

              resolve(self);
            }
          }
        };

        xml.send(null);
      }
      else {
        this.setup(this.src);
        resolve(self);
      }

    },

    _setupFrame: function(frame) {
      var frames = this.frames = [];
      var unitWidth = frame.width;
      var unitHeight = frame.height;

      var count = frame.rows * frame.cols;
      this.frame = count;

      (count).times(function(i) {
        var xIndex = i%frame.cols;
        var yIndex = (i/frame.cols)|0;

        frames.push({
          x: xIndex*unitWidth,
          y: yIndex*unitHeight,
          width: unitWidth,
          height: unitHeight,
        });
      });
    },

    _setupAnim: function(animations) {
      this.animations = {};

      // デフォルトアニメーション
      this.animations["default"] = {
          frames: [].range(0, this.frame),
          next: "default",
          frequency: 1,
      };

      animations.forIn(function(key, value) {
        var anim = value;

        if (anim instanceof Array) {
          this.animations[key] = {
            frames: [].range(anim[0], anim[1]),
            next: anim[2],
            frequency: anim[3] || 1,
          };
        }
        else {
          this.animations[key] = {
            frames: anim.frames,
            next: anim.next,
            frequency: anim.frequency || 1
          };
        }

      }, this);
    },

    /**
     * フレームを取得
     */
    getFrame: function(index) {
      return this.frames[index];
    },

    getAnimation: function(name) {
      name = (name !== undefined) ? name : "default";
      return this.animations[name];
    },

  });

});


phina.namespace(function() {

  /**
   * @class phina.asset.Font
   * 
   */
  phina.define("phina.asset.Font", {
    superClass: "phina.asset.Asset",

    /**
     * @constructor
     */
    init: function() {
      this.superInit();
      this.fontName = null;
    },

    load: function(path) {
      this.src = path;

      var reg = /(.*)(?:\.([^.]+$))/;
      var key = this.fontName || path.match(reg)[1].split('/').last;    //フォント名指定が無い場合はpathの拡張子前を使用
      var type = path.match(reg)[2];
      var format = "unknown";
      switch (type) {
        case "ttf":
          format = "truetype"; break;
        case "otf":
          format = "opentype"; break;
        case "woff":
          format = "woff"; break;
        case "woff2":
          format = "woff2"; break;
        default:
          console.warn("サポートしていないフォント形式です。(" + path + ")");
      }
      this.format = format;
      this.fontName = key;

      if (format !== "unknown") {
        var text = "@font-face { font-family: '{0}'; src: url({1}) format('{2}'); }".format(key, path, format);
        var e = document.querySelector("head");
        var fontFaceStyleElement = document.createElement("style");
        if (fontFaceStyleElement.innerText) {
          fontFaceStyleElement.innerText = text;
        } else {
          fontFaceStyleElement.textContent = text;
        }
        e.appendChild(fontFaceStyleElement);
      }

      return phina.util.Flow(this._load.bind(this));
    },

    _load: function(resolve) {
      if (this.format !== "unknown") {
        this._checkLoaded(this.fontName, function() {
          this.loaded = true;
          resolve(this);
        }.bind(this));
      } else {
        this.loaded = true;
        resolve(this);
      }
    },

    _checkLoaded: function (font, callback) {
      var canvas = phina.graphics.Canvas();
      var DEFAULT_FONT = canvas.context.font.split(' ')[1];
      canvas.context.font = '40px ' + DEFAULT_FONT;

      var checkText = "1234567890-^\\qwertyuiop@[asdfghjkl;:]zxcvbnm,./\!\"#$%&'()=~|QWERTYUIOP`{ASDFGHJKL+*}ZXCVBNM<>?_１２３４５６７８９０－＾￥ｑｗｅｒｔｙｕｉｏｐａｓｄｆｇｈｊｋｌｚｘｃｖｂｎｍ，．あいうかさたなをん時は金なり";
      // 特殊文字対応
      checkText += String.fromCharCode("0xf04b");

      var before = canvas.context.measureText(checkText).width;
      canvas.context.font = '40px ' + font + ', ' + DEFAULT_FONT;

      var timeoutCount = 30;
      var checkLoadFont = function () {
        var after = canvas.context.measureText(checkText).width;
        if (after !== before) {
          setTimeout(function() {
            callback && callback();
          }, 100);
        } else {
          if (--timeoutCount > 0) {
            setTimeout(checkLoadFont, 100);
          }
          else {
            callback && callback();
            console.warn("timeout font loading");
          }
        }
      };
      checkLoadFont();
    },

    setFontName: function(name) {
      if (this.loaded) {
        console.warn("フォント名はLoad前にのみ設定が出来ます(" + name + ")");
        return this;
      }
      this.fontName = name;
      
      return this;
    },

    getFontName: function() {
      return this.fontName;
    },

  });
});


;(function() {
  /**
   * @class phina.input.Input
   * 
   */
  phina.define('phina.input.Input', {

    superClass: 'phina.util.EventDispatcher',

    /** domElement */
    domElement: null,

    /**
     * @constructor
     */
    init: function(domElement) {
      this.superInit();
      
      this.domElement = domElement || window.document;

      this.position = phina.geom.Vector2(0, 0);
      this.deltaPosition = phina.geom.Vector2(0, 0);
      this.prevPosition = phina.geom.Vector2(0, 0);
      this._tempPosition = phina.geom.Vector2(0, 0);
      this.flags = 0;
    },

    update: function() {
      this.last = this.now;
      this.now = this.flags;
      this.start = (this.now ^ this.last) & this.now;
      this.end   = (this.now ^ this.last) & this.last;

      // 変化値を更新
      this.deltaPosition.x = this._tempPosition.x - this.position.x;
      this.deltaPosition.y = this._tempPosition.y - this.position.y;

      if (this.deltaPosition.x === 0 && this.deltaPosition.y === 0) {
        this._moveFlag = false;
      }
      else {
        this._moveFlag = true;
      }

      // 前回の座標を更新
      this.prevPosition.set(this.position.x, this.position.y);

      // 現在の位置を更新
      this.position.set(this._tempPosition.x, this._tempPosition.y);
    },

    _start: function(x, y, flag) {
      flag = (flag !== undefined) ? flag : 1;
      this._move(x, y);

      this.flags |= flag;

      var x = this._tempPosition.x;
      var y = this._tempPosition.y;
      this.position.set(x, y);
      this.prevPosition.set(x, y);
    },

    _end: function(flag) {
      flag = (flag !== undefined) ? flag : 1;
      this.flags &= ~(flag);
    },

    // スケールを考慮
    _move: function(x, y) {
      this._tempPosition.x = x;
      this._tempPosition.y = y;

      // adjust scale
      var elm = this.domElement;
      if (elm.style.width) {
        this._tempPosition.x *= elm.width / parseInt(elm.style.width);
      }
      if (elm.style.height) {
        this._tempPosition.y *= elm.height / parseInt(elm.style.height);
      }
    },

    _accessor: {
      /**
       * @property    x
       * x座標値
       */
      x: {
        "get": function()   { return this.position.x; },
        "set": function(v)  { this.position.x = v; }
      },
      /**
       * @property    y
       * y座標値
       */
      y: {
        "get": function()   { return this.position.y; },
        "set": function(v)  { this.position.y = v; }
      },
      /**
       * @property    dx
       * dx値
       */
      dx: {
        "get": function()   { return this.deltaPosition.x; },
        "set": function(v)  { this.deltaPosition.x = v; }
      },
      /**
       * @property    dy
       * dy値
       */
      dy: {
        "get": function()   { return this.deltaPosition.y; },
        "set": function(v)  { this.deltaPosition.y = v; }
      },
    },
  });


})();

;(function() {

  /**
   * @class phina.input.Mouse
   * @extends phina.input.Input
   */
  phina.define('phina.input.Mouse', {

    superClass: 'phina.input.Input',

    /**
     * @constructor
     */
    init: function(domElement) {
      this.superInit(domElement);

      this.id = 0;

      var self = this;
      this.domElement.addEventListener('mousedown', function(e) {
        self._start(e.pointX, e.pointY, 1<<e.flags);
      });

      this.domElement.addEventListener('mouseup', function(e) {
        self._end(1<<e.flags);
      });
      this.domElement.addEventListener('mousemove', function(e) {
        self._move(e.pointX, e.pointY);
      });
    },

    /**
     * ボタン取得
     */
    getButton: function(button) {
      if (typeof(button) == "string") {
        button = BUTTON_MAP[button];
      }
      
      return (this.now & button) != 0;
    },

    /**
     * ボタンダウン取得
     */
    getButtonDown: function(button) {
      if (typeof(button) === 'string') {
        button = BUTTON_MAP[button];
      }

      return (this.start & button) != 0;
    },
        
    /**
     * ボタンアップ取得
     */
    getButtonUp: function(button) {
      if (typeof(button) == "string") {
        button = BUTTON_MAP[button];
      }
      
      return (this.end & button) != 0;
    },

    _static: {
      /** @static @property */
      BUTTON_LEFT: 0x1,
      /** @static @property */
      BUTTON_MIDDLE: 0x2,
      /** @static @property */
      BUTTON_RIGHT: 0x4,
    }
  });

  var BUTTON_MAP = {
    "left"  : phina.input.Mouse.BUTTON_LEFT,
    "middle": phina.input.Mouse.BUTTON_MIDDLE,
    "right" : phina.input.Mouse.BUTTON_RIGHT
  };

  phina.input.Mouse.prototype.getPointing = function() { return this.getButton("left"); };
  phina.input.Mouse.prototype.getPointingStart = function() { return this.getButtonDown("left"); };
  phina.input.Mouse.prototype.getPointingEnd = function() { return this.getButtonUp("left"); };

})();

;(function() {

  /**
   * @class phina.input.Touch
   * @extends phina.input.Input
   */
  phina.define('phina.input.Touch', {

    superClass: 'phina.input.Input',

    /**
     * @constructor
     */
    init: function(domElement, isMulti) {
      this.superInit(domElement);

      this.id = null;

      if (isMulti === true) {
        return ;
      }

      var self = this;
      this.domElement.addEventListener('touchstart', function(e) {
        self._start(e.pointX, e.pointY, true);
      });

      this.domElement.addEventListener('touchend', function(e) {
        self._end();
      });
      this.domElement.addEventListener('touchmove', function(e) {
        self._move(e.pointX, e.pointY);
      });
    },

    /**
     * タッチしているかを判定
     */
    getTouch: function() {
      return this.touched != 0;
    },
    
    /**
     * タッチ開始時に true
     */
    getTouchStart: function() {
      return this.start != 0;
    },
    
    /**
     * タッチ終了時に true
     */
    getTouchEnd: function() {
      return this.end != 0;
    },

  });

  /**
   * @method
   * ポインティング状態取得(mouse との差異対策)
   */
  phina.input.Touch.prototype.getPointing        = phina.input.Touch.prototype.getTouch;
  /**
   * @method
   * ポインティングを開始したかを取得(mouse との差異対策)
   */
  phina.input.Touch.prototype.getPointingStart   = phina.input.Touch.prototype.getTouchStart;
  /**
   * @method
   * ポインティングを終了したかを取得(mouse との差異対策)
   */
  phina.input.Touch.prototype.getPointingEnd     = phina.input.Touch.prototype.getTouchEnd;


})();


;(function() {

  phina.define('phina.input.TouchList', {
    domElement: null,

    init: function(domElement, length) {
      this.domElement = domElement;

      this.touches = [];
      this.stockes = [];

      (length).times(function() {
        var touch = phina.input.Touch(domElement, true);
        touch.id = null;
        this.stockes.push(touch);
      }, this);

      var self = this;
      this.domElement.addEventListener('touchstart', function(e) {
        Array.prototype.forEach.call(e.changedTouches, function(t) {
          var touch = self.getEmpty();

          touch.id = t.identifier;
          touch._start(t.pointX, t.pointY);
        });
      });

      this.domElement.addEventListener('touchend', function(e) {
        Array.prototype.forEach.call(e.changedTouches, function(t) {
          var touch = self.getTouch(t.identifier);
          touch._end();
        });
      });
      this.domElement.addEventListener('touchmove', function(e) {
        Array.prototype.forEach.call(e.changedTouches, function(t) {
          var touch = self.getTouch(t.identifier);
          touch._move(t.pointX, t.pointY);
        });
        e.stop();
      });
    },

    getEmpty: function() {
      var touch = this.stockes.pop();
      this.touches.push(touch);

      return touch;
    },

    getTouch: function(id) {
      return this.touches.filter(function(touch) {
        return touch.id === id;
      })[0];
    },

    removeTouch: function(touch) {
      var i = this.touches.indexOf(touch);
      this.touches.splice(i, 1);
      this.stockes.push(touch);
    },

    update: function() {
      this.touches.forEach(function(touch) {
        if (touch.id !== null) {
          if (!touch.released) {
            touch.update();

            if (touch.flags === 0) {
              touch.released = true;
            }
          }
          else {
            touch.released = false;
            this.removeTouch(touch);
          }
        }
      }, this);
    }
  })

})();
/*
 *
 */


phina.namespace(function() {

  /**
   * @class phina.input.Keyboard
   * @extends phina.input.Input
   */
  phina.define('phina.input.Keyboard', {

    superClass: 'phina.input.Input',

    /**
     * @constructor
     */
    init: function(domElement) {
      this.superInit(domElement);

      this.key = {};
      this.press  = {};
      this.down   = {};
      this.up     = {};
      this.last   = {};

      var self = this;
      this.domElement.addEventListener('keydown', function(e) {
        self.key[e.keyCode] = true;
        self.flare('keydown', {
          keyCode: e.keyCode,
        });
      });

      this.domElement.addEventListener('keyup', function(e) {
        self.key[e.keyCode] = false;
        self.flare('keyup', {
          keyCode: e.keyCode,
        });
      });
      this.domElement.addEventListener('keypress', function(e) {
        self.flare('keypress', {
          keyCode: e.keyCode,
        });
      });
    },

    /**
     * 情報更新処理
     * マイフレーム呼んで下さい.
     * @private
     */
    update: function() {
      // TODO: 一括ビット演算で行うよう修正する
      for (var k in this.key) {
        this.last[k]    = this.press[k];
        this.press[k]   = this.key[k];
        
        this.down[k] = (this.press[k] ^ this.last[k]) & this.press[k];
        this.up[k] = (this.press[k] ^ this.last[k]) & this.last[k];
      }
      
      return this;
    },

    /**
     * キーを押しているかをチェック
     * @param   {Number/String} key keyCode or keyName
     * @returns {Boolean}   チェック結果
     */
    getKey: function(key) {
      if (typeof(key) === "string") {
        key = phina.input.Keyboard.KEY_CODE[key];
      }
      return !!this.press[key] === true;
    },
    
    /**
     * キーを押したかをチェック
     * @param   {Number/String} key keyCode or keyName
     * @returns {Boolean}   チェック結果
     */
    getKeyDown: function(key) {
      if (typeof(key) == "string") {
        key = phina.input.Keyboard.KEY_CODE[key];
      }
      return this.down[key] == true;
    },
    
    /**
     * キーを離したかをチェック
     * @param   {Number/String} key keyCode or keyName
     * @returns {Boolean}   チェック結果
     */
    getKeyUp: function(key) {
      if (typeof(key) == "string") {
        key = phina.input.Keyboard.KEY_CODE[key];
      }
      return this.up[key] == true;
    },
    
    /**
     * キーの方向を Angle(Degree) で取得
     * @returns {Boolean}   角度(Degree)
     */
    getKeyAngle: function() {
      var angle = null;
      var arrowBit =
        (this.getKey("left")   << 3) | // 1000
        (this.getKey("up")     << 2) | // 0100
        (this.getKey("right")  << 1) | // 0010
        (this.getKey("down"));         // 0001
      
      if (arrowBit != 0 && phina.input.Keyboard.ARROW_BIT_TO_ANGLE_TABLE.hasOwnProperty(arrowBit)) {
        angle = phina.input.Keyboard.ARROW_BIT_TO_ANGLE_TABLE[arrowBit];
      }
      
      return angle;
    },

    /**
     * キーの押している向きを取得
     * 正規化されている
     */
    getKeyDirection: function() {
      var direction = tm.geom.Vector2(0, 0);

      if (this.getKey("left")) {
        direction.x = -1;
      }
      else if (this.getKey("right")) {
        direction.x = 1;
      }
      if (this.getKey("up")) {
        direction.y = -1;
      }
      else if (this.getKey("down")) {
        direction.y = 1;
      }

      if (direction.x && direction.y) {
        direction.div(Math.SQRT2);
      }

      return direction;
    },
    
    /**
     * キーの状態を設定する
     */
    setKey: function(key, flag) {
      if (typeof(key) == "string") {
        key = KEY_CODE[key];
      }
      this.key[key] = flag;
      
      return this;
    },

    /**
     * キーを全て離したことにする
     */
    clearKey: function() {
      this.key = {};
      
      return this;
    },


    /*
     * @enum ARROW_BIT_TO_ANGLE_TABLE
     * 方向のアングル jsduckでは数字をプロパティに指定できない？
     * @private
     */
    _static: {
      ARROW_BIT_TO_ANGLE_TABLE: {
        /* @property 下 */
        0x01: 270,
        /* @property 右 */
        0x02:   0,
        /* @property 上 */
        0x04:  90,
        /* @property 左 */
        0x08: 180,

        /* @property 右上 */
        0x06:  45,
        /* @property 右下 */
        0x03: 315,
        /* @property 左上 */
        0x0c: 135,
        /* @property 左下 */
        0x09: 225,

        // 三方向同時押し対応
        // 想定外の操作だが対応しといたほうが無難
        /* @property 右上左 */
        0x0e:  90,
        /* @property 上左下 */
        0x0d: 180,
        /* @property 左下右 */
        0x0b: 270,
        /* @property 下右上 */
        0x07:   0,
      },

      /*
       * @enum KEY_CODE
       * キー番号
       * @private
       */
      KEY_CODE: {
        /* @property */
        "backspace" : 8,
        /* @property */
        "tab"       : 9,
        /* @property */
        "enter"     : 13,
        /* @property */
        "return"    : 13,
        /* @property */
        "shift"     : 16,
        /* @property */
        "ctrl"      : 17,
        /* @property */
        "alt"       : 18,
        /* @property */
        "pause"     : 19,
        /* @property */
        "capslock"  : 20,
        /* @property */
        "escape"    : 27,
        /* @property */
        "pageup"    : 33,
        /* @property */
        "pagedown"  : 34,
        /* @property */
        "end"       : 35,
        /* @property */
        "home"      : 36,
        /* @property */
        "left"      : 37,
        /* @property */
        "up"        : 38,
        /* @property */
        "right"     : 39,
        /* @property */
        "down"      : 40,
        /* @property */
        "insert"    : 45,
        /* @property */
        "delete"    : 46,
        
        /* @property */
        "0" : 48,
        /* @property */
        "1" : 49,
        /* @property */
        "2" : 50,
        /* @property */
        "3" : 51,
        /* @property */
        "4" : 52,
        /* @property */
        "5" : 53,
        /* @property */
        "6" : 54,
        /* @property */
        "7" : 55,
        /* @property */
        "8" : 56,
        /* @property */
        "9" : 57,
        /* @property */
        
        "a" : 65,
        /* @property */
        "A" : 65,
        /* @property */
        "b" : 66,
        /* @property */
        "B" : 66,
        /* @property */
        "c" : 67,
        /* @property */
        "C" : 67,
        /* @property */
        "d" : 68,
        /* @property */
        "D" : 68,
        /* @property */
        "e" : 69,
        /* @property */
        "E" : 69,
        /* @property */
        "f" : 70,
        /* @property */
        "F" : 70,
        /* @property */
        "g" : 71,
        /* @property */
        "G" : 71,
        /* @property */
        "h" : 72,
        /* @property */
        "H" : 72,
        /* @property */
        "i" : 73,
        /* @property */
        "I" : 73,
        /* @property */
        "j" : 74,
        /* @property */
        "J" : 74,
        /* @property */
        "k" : 75,
        /* @property */
        "K" : 75,
        /* @property */
        "l" : 76,
        /* @property */
        "L" : 76,
        /* @property */
        "m" : 77,
        /* @property */
        "M" : 77,
        /* @property */
        "n" : 78,
        /* @property */
        "N" : 78,
        /* @property */
        "o" : 79,
        /* @property */
        "O" : 79,
        /* @property */
        "p" : 80,
        /* @property */
        "P" : 80,
        /* @property */
        "q" : 81,
        /* @property */
        "Q" : 81,
        /* @property */
        "r" : 82,
        /* @property */
        "R" : 82,
        /* @property */
        "s" : 83,
        /* @property */
        "S" : 83,
        /* @property */
        "t" : 84,
        /* @property */
        "T" : 84,
        /* @property */
        "u" : 85,
        /* @property */
        "U" : 85,
        /* @property */
        "v" : 86,
        /* @property */
        "V" : 86,
        /* @property */
        "w" : 87,
        /* @property */
        "W" : 87,
        /* @property */
        "x" : 88,
        /* @property */
        "X" : 88,
        /* @property */
        "y" : 89,
        /* @property */
        "Y" : 89,
        /* @property */
        "z" : 90,
        /* @property */
        "Z" : 90,
        
        /* @property */
        "numpad0" : 96,
        /* @property */
        "numpad1" : 97,
        /* @property */
        "numpad2" : 98,
        /* @property */
        "numpad3" : 99,
        /* @property */
        "numpad4" : 100,
        /* @property */
        "numpad5" : 101,
        /* @property */
        "numpad6" : 102,
        /* @property */
        "numpad7" : 103,
        /* @property */
        "numpad8" : 104,
        /* @property */
        "numpad9" : 105,
        /* @property */
        "multiply"      : 106,
        /* @property */
        "add"           : 107,
        /* @property */
        "subtract"      : 109,
        /* @property */
        "decimalpoint"  : 110,
        /* @property */
        "divide"        : 111,

        /* @property */
        "f1"    : 112,
        /* @property */
        "f2"    : 113,
        /* @property */
        "f3"    : 114,
        /* @property */
        "f4"    : 115,
        /* @property */
        "f5"    : 116,
        /* @property */
        "f6"    : 117,
        /* @property */
        "f7"    : 118,
        /* @property */
        "f8"    : 119,
        /* @property */
        "f9"    : 120,
        /* @property */
        "f10"   : 121,
        /* @property */
        "f11"   : 122,
        /* @property */
        "f12"   : 123,
        
        /* @property */
        "numlock"   : 144,
        /* @property */
        "scrolllock": 145,
        /* @property */
        "semicolon" : 186,
        /* @property */
        "equalsign" : 187,
        /* @property */
        "comma"     : 188,
        /* @property */
        "dash"      : 189,
        /* @property */
        "period"    : 190,
        /* @property */
        "forward slash" : 191,
        /* @property */
        "/": 191,
        /* @property */
        "grave accent"  : 192,
        /* @property */
        "open bracket"  : 219,
        /* @property */
        "back slash"    : 220,
        /* @property */
        "close bracket"  : 221,
        /* @property */
        "single quote"  : 222,
        /* @property */
        "space"         : 32

      },
    }
  });

});

phina.namespace(function() {

  /**
   * ゲームパッドマネージャー.
   *
   * ゲームパッド接続状況の監視、個々のゲームパッドの入力状態の更新を行う.
   */
  phina.define('phina.input.GamepadManager', {
    superClass: 'phina.util.EventDispatcher',

    /**
     * 作成済みphina.input.Gamepadオブジェクトのリスト
     *
     * @type {Object.<number, phina.input.Gamepad>}
     */
    gamepads: null,

    /**
     * 作成済みゲームパッドのindexのリスト
     *
     * @type {number[]}
     * @private
     */
    _created: null,

    /**
     * ラップ前Gamepadのリスト
     * @type {Gamepad[]}
     * @private
     */
    _rawgamepads: null,

    init: function() {
      this.superInit();

      this.gamepads = {};
      this._created = [];
      this._rawgamepads = [];

      this._prevTimestamps = {};

      this._getGamepads = null;
      var navigator = phina.global.navigator;
      if (navigator && navigator.getGamepads) {
        this._getGamepads = navigator.getGamepads.bind(navigator);
      } else if (navigator && navigator.webkitGetGamepads) {
        this._getGamepads = navigator.webkitGetGamepads.bind(navigator);
      } else {
        this._getGamepads = function() {};
      }

      phina.global.addEventListener('gamepadconnected', function(e) {
        var gamepad = this.get(e.gamepad.index);
        gamepad.connected = true;
        this.flare('connected', {
          gamepad: gamepad,
        });
      }.bind(this));

      phina.global.addEventListener('gamepaddisconnected', function(e) {
        var gamepad = this.get(e.gamepad.index);
        gamepad.connected = false;
        this.flare('disconnected', {
          gamepad: gamepad,
        });
      }.bind(this));
    },

    /**
     * 情報更新処理
     * マイフレーム呼んで下さい.
     */
    update: function() {
      this._poll();

      for (var i = 0, end = this._created.length; i < end; i++) {
        var index = this._created[i];
        var rawgamepad = this._rawgamepads[index];

        if (!rawgamepad) {
          continue;
        }

        if (rawgamepad.timestamp && (rawgamepad.timestamp === this._prevTimestamps[i])) {
          this.gamepads[index]._updateStateEmpty();
          continue;
        }

        this._prevTimestamps[i] = rawgamepad.timestamp;
        this.gamepads[index]._updateState(rawgamepad);
      }
    },

    /**
     * 指定されたindexのGamepadオブジェクトを返す.
     *
     * 未作成の場合は作成して返す.
     */
    get: function(index) {
      index = index || 0;

      if (!this.gamepads[index]) {
        this._created.push(index);
        this.gamepads[index] = phina.input.Gamepad(index);
      }

      return this.gamepads[index];
    },

    /**
     * 指定されたindexのGamepadオブジェクトを破棄する.
     * 破棄されたGamepadオブジェクトは以降更新されない.
     */
    dispose: function(index) {
      if (this._created.contains(index)) {
        var gamepad = this.get(index);
        delete this.gamepad[gamepad];
        this._created.erase(index);

        gamepad.connected = false;
      }
    },

    /**
     * 指定されたindexのゲームパッドが接続中かどうかを返す.
     *
     * Gamepadオブジェクトが未作成の場合でも動作する.
     */
    isConnected: function(index) {
      index = index || 0;

      return this._rawgamepads[index] && this._rawgamepads[index].connected;
    },

    /**
     * @private
     */
    _poll: function() {
      var rawGamepads = this._getGamepads();
      if (rawGamepads) {
        this._rawgamepads.clear();

        for (var i = 0, end = rawGamepads.length; i < end; i++) {
          if (rawGamepads[i]) {
            this._rawgamepads.push(rawGamepads[i]);
          }
        }
      }
    },

    _static: {
      /** ブラウザがGamepad APIに対応しているか. */
      isAvailable: (function() {
        var nav = phina.global.navigator;
        if (!nav) return false;

        return (!!nav.getGamepads) || (!!nav.webkitGetGamepads);
      })(),
    },

  });

  /**
   * ゲームパッド
   *
   * 直接インスタンス化せず、phina.input.GamepadManagerオブジェクトから取得して使用する.
   */
  phina.define("phina.input.Gamepad", {

    index: null,
    buttons: null,
    /** @type {Array.<phina.geom.Vector2>} */
    sticks: null,

    id: null,
    connected: false,
    mapping: null,
    timestamp: null,

    init: function(index) {
      this.index = index || 0;

      this.buttons = Array.range(0, 16).map(function() {
        return {
          value: 0,
          pressed: false,
          last: false,
          down: false,
          up: false,
        };
      });
      this.sticks = Array.range(0, 2).map(function() {
        return phina.geom.Vector2(0, 0);
      });
    },

    /**
     * ボタンが押されているか.
     */
    getKey: function(button) {
      if (typeof(button) === 'string') {
        button = phina.input.Gamepad.BUTTON_CODE[button];
      }
      if (this.buttons[button]) {
        return this.buttons[button].pressed;
      } else {
        return false;
      }
    },

    /**
     * ボタンを押した.
     */
    getKeyDown: function(button) {
      if (typeof(button) === 'string') {
        button = phina.input.Gamepad.BUTTON_CODE[button];
      }
      if (this.buttons[button]) {
        return this.buttons[button].down;
      } else {
        return false;
      }
    },

    /**
     * ボタンを離した.
     */
    getKeyUp: function(button) {
      if (typeof(button) === 'string') {
        button = phina.input.Gamepad.BUTTON_CODE[button];
      }
      if (this.buttons[button]) {
        return this.buttons[button].up
      } else {
        return false;
      }
    },

    /**
     * 十字キーの入力されている方向.
     */
    getKeyAngle: function() {
      var angle = null;
      var arrowBit =
        (this.getKey('left') << 3) | // 1000
        (this.getKey('up') << 2) | // 0100
        (this.getKey('right') << 1) | // 0010
        (this.getKey('down')); // 0001

      if (arrowBit != 0 && ARROW_BIT_TO_ANGLE_TABLE.hasOwnProperty(arrowBit)) {
        angle = ARROW_BIT_TO_ANGLE_TABLE[arrowBit];
      }

      return angle;
    },

    /**
     * 十字キーの入力されている方向をベクトルで.
     * 正規化されている.
     */
    getKeyDirection: function() {
      var direction = phina.geom.Vector2(0, 0);

      if (this.getKey('left')) {
        direction.x = -1;
      } else if (this.getKey('right')) {
        direction.x = 1;
      }
      if (this.getKey('up')) {
        direction.y = -1;
      } else if (this.getKey('down')) {
        direction.y = 1;
      }

      if (direction.x && direction.y) {
        direction.div(Math.SQRT2);
      }

      return direction;
    },

    /**
     * スティックの入力されている方向.
     */
    getStickAngle: function(stickId) {
      stickId = stickId || 0;
      var stick = this.sticks[stickId];
      return stick ? Math.atan2(-stick.y, stick.x) : null;
    },

    /**
     * スティックの入力されている方向をベクトルで.
     */
    getStickDirection: function(stickId) {
      stickId = stickId || 0;
      return this.sticks ? this.sticks[stickId].clone() : phina.geom.Vector2(0, 0);
    },

    /**
     * @private
     */
    _updateState: function(gamepad) {
      this.id = gamepad.id;
      this.connected = gamepad.connected;
      this.mapping = gamepad.mapping;
      this.timestamp = gamepad.timestamp;

      for (var i = 0, iend = gamepad.buttons.length; i < iend; i++) {
        this._updateButton(gamepad.buttons[i], i);
      }

      for (var j = 0, jend = gamepad.axes.length; j < jend; j += 2) {
        this._updateStick(gamepad.axes[j + 0], j / 2, 'x');
        this._updateStick(gamepad.axes[j + 1], j / 2, 'y');
      }
    },

    /**
     * @private
     */
    _updateStateEmpty: function() {
      for (var i = 0, iend = this.buttons.length; i < iend; i++) {
        this.buttons[i].down = false;
        this.buttons[i].up = false;
      }
    },

    /**
     * @private
     */
    _updateButton: function(value, buttonId) {
      if (this.buttons[buttonId] === undefined) {
        this.buttons[buttonId] = {
          value: 0,
          pressed: false,
          last: false,
          down: false,
          up: false,
        };
      }
      
      var button = this.buttons[buttonId];

      button.last = button.pressed;

      if (typeof value === 'object') {
        button.value = value.value;
        button.pressed = value.pressed;
      } else {
        button.value = value;
        button.pressed = value > phina.input.Gamepad.ANALOGUE_BUTTON_THRESHOLD;
      }

      button.down = (button.pressed ^ button.last) & button.pressed;
      button.up = (button.pressed ^ button.last) & button.last;
    },

    /**
     * @private
     */
    _updateStick: function(value, stickId, axisName) {
      if (this.sticks[stickId] === undefined) {
        this.sticks[stickId] = phina.geom.Vector2(0, 0);
      }
      this.sticks[stickId][axisName] = value;
    },

    _static: {
      /** ブラウザがGamepad APIに対応しているか. */
      isAvailable: (function() {
        var nav = phina.global.navigator;
        if (!nav) return false;

        return (!!nav.getGamepads) || (!!nav.webkitGetGamepads);
      })(),

      /** アナログ入力対応のボタンの場合、どの程度まで押し込むとonになるかを表すしきい値. */
      ANALOGUE_BUTTON_THRESHOLD: 0.5,

      /** ボタン名とボタンIDのマップ. */
      BUTTON_CODE: {
        'a': 0,
        'b': 1,
        'x': 2,
        'y': 3,

        'l1': 4,
        'r1': 5,
        'l2': 6,
        'r2': 7,

        'select': 8,
        'start': 9,

        'l3': 10,
        'r3': 11,

        'up': 12,
        'down': 13,
        'left': 14,
        'right': 15,

        'special': 16,

        'A': 0,
        'B': 1,
        'X': 2,
        'Y': 3,

        'L1': 4,
        'R1': 5,
        'L2': 6,
        'R2': 7,

        'SELECT': 8,
        'START': 9,

        'L3': 10,
        'R3': 11,

        'UP': 12,
        'DOWN': 13,
        'LEFT': 14,
        'RIGHT': 15,

        'SPECIAL': 16,
      },
    },
  });

  var ARROW_BIT_TO_ANGLE_TABLE = {
    0x00: null,

    /* @property 下 */
    0x01: 270,
    /* @property 右 */
    0x02: 0,
    /* @property 上 */
    0x04: 90,
    /* @property 左 */
    0x08: 180,

    /* @property 右上 */
    0x06: 45,
    /* @property 右下 */
    0x03: 315,
    /* @property 左上 */
    0x0c: 135,
    /* @property 左下 */
    0x09: 225,

    // 三方向同時押し対応
    // 想定外の操作だが対応しといたほうが無難
    /* @property 右上左 */
    0x0e: 90,
    /* @property 上左下 */
    0x0d: 180,
    /* @property 左下右 */
    0x0b: 270,
    /* @property 下右上 */
    0x07: 0,
  };

});

phina.namespace(function() {


  phina.define('phina.app.Updater', {

    init: function(app) {
      this.app = app;
    },

    update: function(root) {
      this._updateElement(root);
    },

    _updateElement: function(element) {
      var app = this.app;

      // 更新するかを判定
      if (element.awake === false) return ;

      // エンターフレームイベント
      if (element.has('enterframe')) {
        element.flare('enterframe', {
          app: this.app,
        });
      }

      // 更新
      if (element.update) element.update(app);

      // タッチ判定
      // this._checkPoint(element);

      // 子供を更新
      var len = element.children.length;
      if (element.children.length > 0) {
        var tempChildren = element.children.slice();
        for (var i=0; i<len; ++i) {
          this._updateElement(tempChildren[i]);
        }
      }
    },

    _checkPoint: function(obj) {

      this.app.pointers.forEach(function(p) {
        if (p.id !== null) {
          this.__checkPoint(obj, p);
        }
      }, this);
    },

    __checkPoint: function(obj, p) {
      if (!obj.interactive) return ;

      var prevOverFlag = obj._overFlags[p.id];
      var overFlag = obj.hitTest2(p.x, p.y);
      obj._overFlags[p.id] = overFlag;

      if (!prevOverFlag && overFlag) {
        obj.flare('pointover', {
          pointer: p,
        });
      }
      if (prevOverFlag && !overFlag) {
        obj.flare('pointout');
      }

      if (overFlag) {
        if (p.getPointingStart()) {
          obj._touchFlags[p.id] = true;
          obj.flare('pointstart');
        }
      }

      if (obj._touchFlags[p.id]) {
        obj.flare('pointstay');
        if (p._moveFlag) {
          obj.flare('pointmove');
        }
      }

      if (obj._touchFlags[p.id]===true && p.getPointingEnd()) {
        obj._touchFlags[p.id] = false;
        obj.flare('pointend');

        if (obj._overFlags[p.id]) {
          obj._overFlags[p.id] = false;
          obj.flare('pointout');
        }
      }
    },

  });

  
});

phina.namespace(function() {


  phina.define('phina.app.Interactive', {

    init: function(app) {
      this.app = app;
      this._enable = true;
    },

    enable: function() {
      this._enable = true;
      return this;
    },
    disable: function() {
      this._enable = false;
      return this;
    },

    check: function(root) {
      if (!this._enable) return ;
      this._checkElement(root)
    },

    _checkElement: function(element) {
      var app = this.app;

      // 更新するかを判定
      if (element.awake === false) return ;

      // タッチ判定
      this._checkPoint(element);

      // 子供を更新
      var len = element.children.length;
      if (element.children.length > 0) {
        var tempChildren = element.children.slice();
        for (var i=0; i<len; ++i) {
          this._checkElement(tempChildren[i]);
        }
      }
    },

    _checkPoint: function(obj) {
      this.app.pointers.forEach(function(p) {
        if (p.id !== null) {
          this.__checkPoint(obj, p);
        }
      }, this);
    },

    __checkPoint: function(obj, p) {
      if (!obj.interactive) return ;

      var prevOverFlag = obj._overFlags[p.id];
      var overFlag = obj.hitTest(p.x, p.y);
      obj._overFlags[p.id] = overFlag;

      if (!prevOverFlag && overFlag) {
        obj.flare('pointover', {
          pointer: p,
        });
      }
      if (prevOverFlag && !overFlag) {
        obj.flare('pointout');
      }

      if (overFlag) {
        if (p.getPointingStart()) {
          obj._touchFlags[p.id] = true;
          obj.flare('pointstart', {
            pointer: p,
          });
          // クリックフラグを立てる
          obj._clicked = true;
        }
      }

      if (obj._touchFlags[p.id]) {
        obj.flare('pointstay');
        if (p._moveFlag) {
          obj.flare('pointmove', {
            pointer: p,
          });
        }
      }

      if (obj._touchFlags[p.id]===true && p.getPointingEnd()) {
        obj._touchFlags[p.id] = false;
        obj.flare('pointend');

        if (obj._overFlags[p.id]) {
          obj._overFlags[p.id] = false;
          obj.flare('pointout');
        }
      }
    },
  });

  
});

phina.namespace(function() {

  /**
   * @class phina.app.BaseApp
   * ベースとなるアプリケーションクラス
   */
  phina.define('phina.app.BaseApp', {
    superClass: 'phina.util.EventDispatcher',

    /** awake */
    awake: null,
    /** fps */
    fps: null,
    /** frame */
    frame: null,

    /**
     * @constructor
     */
    init: function(element) {
      this.superInit();
      this._scenes = [phina.app.Scene()];
      this._sceneIndex = 0;

      this.updater = phina.app.Updater(this);
      this.interactive = phina.app.Interactive(this);

      this.awake = true;
      this.ticker = phina.util.Ticker();
    },

    run: function() {
      var self = this;

      this.ticker.tick(function() {
        self._loop();
      });

      this.ticker.start();

      return this;
    },

    replaceScene: function(scene) {
      var e = null;
      if (this.currentScene) {
        this.currentScene.app = null;
      }
      this.currentScene = scene;
      this.currentScene.app = this;
      this.currentScene.flare('enter', {
        app: this,
      });

      return this;
    },

    pushScene: function(scene) {
      this.flare('push');

      this.currentScene.flare('pause', {
        app: this,
      });
      
      this._scenes.push(scene);
      ++this._sceneIndex;

      this.flare('pushed');
      
      scene.app = this;
      scene.flare('enter', {
        app: this,
      });

      return this;
    },

    /**
     * シーンをポップする(ポーズやオブション画面などで使用)
     */
    popScene: function() {
      this.flare('pop');

      var scene = this._scenes.pop();
      --this._sceneIndex;

      scene.flare('exit', {
        app: this,
      });
      scene.app = null;

      this.flare('poped');
      
      // 
      this.currentScene.flare('resume', {
        app: this,
        prevScene: scene,
      });
      
      return scene;
    },

    /**
     * シーンのupdateを実行するようにする
     */
    start: function() {
      this.awake = true;

      return this;
    },
    
    /**
     * シーンのupdateを実行しないようにする
     */
    stop: function() {
      this.awake = false;

      return this;
    },

    enableStats: function() {
      if (phina.global.Stats) {
        this.stats = new Stats();
        document.body.appendChild(this.stats.domElement);
      }
      else {
        // console.warn("not defined stats.");
        var STATS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/stats.js/r14/Stats.js';
        var script = document.createElement('script');
        script.src = STATS_URL;
        document.body.appendChild(script);
        script.onload = function() {
          this.enableStats();
        }.bind(this);
      }
      return this;
    },

    _loop: function() {
      this._update();
      this._draw();

      // stats update
      if (this.stats) this.stats.update();
    },

    _update: function() {
      if (this.awake) {
        this.update && this.update();
        this.updater.update(this.currentScene);
        this.interactive.check(this.currentScene);
      }
    },

    /**
     * 描画用仮想関数
     * @private
     */
    _draw: function() {},

    _accessor: {
      currentScene: {
        "get": function()   { return this._scenes[this._sceneIndex]; },
        "set": function(v)  { this._scenes[this._sceneIndex] = v; },
      },

      frame: {
        "get": function () { return this.ticker.frame; },
        "set": function (v) { this.ticker.frame = v; },
      },

      fps: {
        "get": function () { return this.ticker.fps; },
        "set": function (v) { this.ticker.fps = v; },
      },

      deltaTime: {
        "get": function () { return this.ticker.deltaTime; },
      },

      elapsedTime: {
        "get": function () { return this.ticker.elapsedTime; },
      },

      currentTime: {
        "get": function () { return this.ticker.currentTime; },
      },

      startTime: {
        "get": function () { return this.ticker.startTime; },
      },
    },

  });

  
});


phina.namespace(function() {

  /**
   * @class phina.app.Element
   * @extends phina.util.EventDispatcher
   */
  phina.define('phina.app.Element', {
    superClass: 'phina.util.EventDispatcher',

    /// 親
    parent: null,

    /// 子供
    children: null,

    /**
     * @constructor
     */
    init: function() {
      this.superInit();
      this.children = [];
    },

    addChild: function(child) {
      if (child.parent) child.remove();

      child.parent = this;
      this.children.push(child);

      child.has('added') && child.flare('added');

      return child;
    },

    addChildTo: function(parent) {
      parent.addChild(this);

      return this;
    },

    addChildAt: function(child, index) {
      if (child.parent) child.remove();

      child.parent = this;
      this.children.splice(index, 0, child);

      child.has('added') && child.flare('added');

      return child;
    },

    getChildAt: function(index) {
      return this.children.at(index);
    },

    getChildByName: function(name) {
      // TODO: 
    },

    getChildIndex: function(child) {
      return this.children.indexOf(child);
    },

    getParent: function() {
      return this.parent;
    },

    getRoot: function() {
      var elm = this;
      for (elm=this.parent; elm.parent != null; elm = elm.parent) {

      }
      return elm;
    },

    removeChild: function(child) {
      var index = this.children.indexOf(child);
      if (index !== -1) {
        this.children.splice(index, 1);
        child.has('removed') && child.flare('removed');
      }
      return this;
    },

    remove: function() {
      if (!this.parent) return ;

      this.parent.removeChild(this);
      this.parent = null;
      
      return this;
    },

    fromJSON: function(json) {

      var createChildren = function(name, data) {
        // 
        var args = data.arguments;
        args = (args instanceof Array) ? args : [args];
        // 
        var _class = phina.using(data.className);
        // 
        var element = _class.apply(null, args);
        
        element.name = name;
        this[name] = element;

        element.fromJSON(data);
        element.addChildTo(this)
      }.bind(this);

      json.forIn(function(key, value) {
        if (key === 'children') {
          value.forIn(function(name, data) {
            createChildren(name, data);
          });
        }
        else {
          if (key !== 'type') {
            this[key] = value;
          }
        }
      }, this);

      return this;
    },

    toJSON: function() {
      var json = {};

      // this.forIn(function(key, value) {
      //   if (key[0] === '_') return ;
      //   json[key] = value;
      // });

      var keys = [
        'x', 'y',
        'rotation',
        'scaleX', 'scaleY',
        'originX', 'originY',
        'className',
        'name',
      ];

      keys.each(function(key) {
        json[key] = this[key];
      }, this);

      var children = this.children.map(function(child) {
        return child.toJSON();
      });

      if (children.length) {
        json.children = {};
        children.each(function(child) {
          json.children[child.name] = child;
        });
      }

      return json;
    },
  });
  
});

phina.namespace(function() {

  /**
   * @class phina.app.Object2D
   * Object2D
   * @extends phina.app.Element
   */
  phina.define('phina.app.Object2D', {
    superClass: 'phina.app.Element',

    /** 位置 */
    position: null,
    /** 回転 */
    rotation: 0,
    /** スケール */
    scale: null,
    /** 基準位置 */
    origin: null,


    init: function() {
      this.superInit();
      
      this.position = phina.geom.Vector2(0, 0);
      this.scale    = phina.geom.Vector2(1, 1);
      this.origin   = phina.geom.Vector2(0.5, 0.5);

      this._matrix = phina.geom.Matrix33().identity();
      this._worldMatrix = phina.geom.Matrix33().identity();

      this.interactive = false;
      this._overFlags = {};
      this._touchFlags = {};
    },

    /**
     * 点と衝突しているかを判定
     * @param {Number} x
     * @param {Number} y
     */
    // hitTest: function(x, y) {
    //   return (this.left < x && x < this.right) && (this.top < y && y < this.bottom);
    // },
    hitTest: function(x, y) {
      var p = this.globalToLocal(phina.geom.Vector2(x, y));

      var left   = -this.width*this.originX;
      var right  = +this.width*(1-this.originX);
      var top    = -this.height*this.originY;
      var bottom = +this.height*(1-this.originY);

      return ( left < p.x && p.x < right ) && ( top  < p.y && p.y < bottom );
    },

    /**
     * 要素と衝突しているかを判定
     * @param {Object} elm
     */
    hitTestElement: function(elm) {
      var rect0 = this;
      var rect1 = elm;
      return (rect0.left < rect1.right) && (rect0.right > rect1.left) &&
             (rect0.top < rect1.bottom) && (rect0.bottom > rect1.top);
    },


    globalToLocal: function(p) {
      var matrix = this._worldMatrix.clone();
      matrix.invert();
      // matrix.transpose();

      var temp = matrix.multiplyVector2(p);

      return temp;
    },

    setInteractive: function(flag) {
      this.interactive = flag;
      return this;
    },

    /**
     * X 座標値をセット
     * @param {Number} x
     */
    setX: function(x) {
      this.position.x = x;
      return this;
    },
    
    /**
     * Y 座標値をセット
     * @param {Number} y
     */
    setY: function(y) {
      this.position.y = y;
      return this;
    },
    
    /**
     * XY 座標をセット
     * @param {Number} x
     * @param {Number} y
     */
    setPosition: function(x, y) {
      this.position.x = x;
      this.position.y = y;
      return this;
    },

    /**
     * 回転をセット
     * @param {Number} rotation
     */
    setRotation: function(rotation) {
      this.rotation = rotation;
      return this;
    },

    /**
     * スケールをセット
     * @param {Number} x
     * @param {Number} y
     */
    setScale: function(x, y) {
      this.scale.x = x;
      if (arguments.length <= 1) {
          this.scale.y = x;
      } else {
          this.scale.y = y;
      }
      return this;
    },
    
    /**
     * 基準点をセット
     * @param {Number} x
     * @param {Number} y
     */
    setOrigin: function(x, y) {
      this.origin.x = x;
      this.origin.y = y;
      return this;
    },
    
    /**
     * 幅をセット
     * @param {Number} width
     */
    setWidth: function(width) {
      this.width = width;
      return this;
    },
    
    /**
     * 高さをセット
     * @param {Number} height
     */
    setHeight: function(height) {
      this.height = height;
      return this;
    },
    
    /**
     * サイズ(幅, 高さ)をセット
     * @param {Number} width
     * @param {Number} height
     */
    setSize: function(width, height) {
      this.width  = width;
      this.height = height;
      return this;
    },


    _calcWorldMatrix: function() {
      if (!this.parent) return ;

      // cache check
      if (this.rotation != this._cachedRotation) {
        this._cachedRotation = this.rotation;

        var r = this.rotation*(Math.PI/180);
        this._sr = Math.sin(r);
        this._cr = Math.cos(r);
      }

      var local = this._matrix;
      var parent = this.parent._worldMatrix || phina.geom.Matrix33.IDENTITY;
      var world = this._worldMatrix;

      // ローカルの行列を計算
      local.m00 = this._cr * this.scale.x;
      local.m01 =-this._sr * this.scale.y;
      local.m10 = this._sr * this.scale.x;
      local.m11 = this._cr * this.scale.y;
      local.m02 = this.position.x;
      local.m12 = this.position.y;

      // cache
      var a00 = local.m00; var a01 = local.m01; var a02 = local.m02;
      var a10 = local.m10; var a11 = local.m11; var a12 = local.m12;
      var b00 = parent.m00; var b01 = parent.m01; var b02 = parent.m02;
      var b10 = parent.m10; var b11 = parent.m11; var b12 = parent.m12;

      // 親の行列と掛け合わせる
      world.m00 = b00 * a00 + b01 * a10;
      world.m01 = b00 * a01 + b01 * a11;
      world.m02 = b00 * a02 + b01 * a12 + b02;

      world.m10 = b10 * a00 + b11 * a10;
      world.m11 = b10 * a01 + b11 * a11;
      world.m12 = b10 * a02 + b11 * a12 + b12;

      return this;
    },

    _accessor: {
      /**
       * @property    x
       * x座標値
       */
      x: {
          "get": function()   { return this.position.x; },
          "set": function(v)  { this.position.x = v; }
      },
      /**
       * @property    y
       * y座標値
       */
      y: {
          "get": function()   { return this.position.y; },
          "set": function(v)  { this.position.y = v; }
      },

      /**
       * @property    originX
       * x座標値
       */
      originX: {
          "get": function()   { return this.origin.x; },
          "set": function(v)  { this.origin.x = v; }
      },
      
      /**
       * @property    originY
       * y座標値
       */
      originY: {
          "get": function()   { return this.origin.y; },
          "set": function(v)  { this.origin.y = v; }
      },
      
      /**
       * @property    scaleX
       * スケールX値
       */
      scaleX: {
          "get": function()   { return this.scale.x; },
          "set": function(v)  { this.scale.x = v; }
      },
      
      /**
       * @property    scaleY
       * スケールY値
       */
      scaleY: {
          "get": function()   { return this.scale.y; },
          "set": function(v)  { this.scale.y = v; }
      },
      
      /**
       * @property    width
       * width
       */
      width: {
          "get": function()   { return this._width; },
          "set": function(v)  { this._width = v; }
      },
      /**
       * @property    height
       * height
       */
      height: {
          "get": function()   { return this._height; },
          "set": function(v)  { this._height = v; }
      },

      /**
       * @property    radius
       * 半径
       */
      radius: {
          "get": function()   {
              return (this._radius !== undefined) ? this._radius : (this.width+this.height)/4;
          },
          "set": function(v)  { this._radius = v; }
      },
      
      /**
       * @property    top
       * 左
       */
      top: {
          "get": function()   { return this.y - this.height*this.originY; },
          "set": function(v)  { this.y = v + this.height*this.originY; },
      },
   
      /**
       * @property    right
       * 左
       */
      right: {
          "get": function()   { return this.x + this.width*(1-this.originX); },
          "set": function(v)  { this.x = v - this.width*(1-this.originX); },
      },
   
      /**
       * @property    bottom
       * 左
       */
      bottom: {
          "get": function()   { return this.y + this.height*(1-this.originY); },
          "set": function(v)  { this.y = v - this.height*(1-this.originY); },
      },
   
      /**
       * @property    left
       * 左
       */
      left: {
        "get": function()   { return this.x - this.width*this.originX; },
        "set": function(v)  { this.x = v + this.width*this.originX; },
      },

      /**
       * @property    centerX
       * centerX
       */
      centerX: {
        "get": function()   { return this.x + this.width/2 - this.width*this.originX; },
        "set": function(v)  {
          // TODO: どうしようかな??
        }
      },
   
      /**
       * @property    centerY
       * centerY
       */
      centerY: {
        "get": function()   { return this.y + this.height/2 - this.height*this.originY; },
        "set": function(v)  {
          // TODO: どうしようかな??
        }
      },
    }
  });

  
});

phina.namespace(function() {


  phina.define('phina.app.Scene', {
    superClass: 'phina.app.Element',

    init: function() {
      this.superInit();
    },

    exit: function(param) {
      if (!this.app) return ;

      if (typeof param !== 'object') {
        var temp = {};
        temp.nextLabel = arguments[0];
        temp.nextArguments = arguments[1];
        param = temp;
      }

      if (param.nextLabel) {
        this.nextLabel = param.nextLabel;
      }
      if (param.nextArguments) {
        this.nextArguments = param.nextArguments;
      }

      this.app.popScene();

      return this;
    },
  });
  
});


phina.namespace(function() {

  /**
   * @class phina.accessory.Accessory
   */
  phina.define('phina.accessory.Accessory', {
    superClass: 'phina.util.EventDispatcher',

    /**
     * @constructor
     */
    init: function(target) {
      this.superInit();

      this.target = target;
    },
    setTarget: function(target) {
      if (this.target === target) return ;

      this.target = target;
      return this;
    },
    getTarget: function() {
      return this.target;
    },
    isAttached: function() {
      return !!this.target;
    },
    attachTo: function(element) {
      element.attach(this);
      this.setTarget(element);
      return this;
    },
    remove: function() {
      this.target.detach(this);
      this.target = null;
    },
  });

  phina.app.Element.prototype.method('attach', function(accessory) {
    if (!this.accessories) {
      this.accessories = [];
      this.on('enterframe', function(e) {
        this.accessories.each(function(accessory) {
          accessory.update && accessory.update(e.app);
        });
      });
    }

    this.accessories.push(accessory);
    accessory.setTarget(this);
    accessory.flare('attached');

    return this;
  });

  phina.app.Element.prototype.method('detach', function(accessory) {
    if (this.accessories) {
      this.accessories.erase(accessory);
      accessory.setTarget(null);
      accessory.flare('detached');
    }

    return this;
  });

});






phina.namespace(function() {

  phina.define('phina.accessory.Tweener', {
    superClass: 'phina.accessory.Accessory',

    /**
     * @constructor
     */
    init: function(target) {
      this.superInit(target);

      this._loop = false;
      this._init();
    },

    _init: function() {
      this._tasks = [];
      this._index = 0;
      this.playing = true;
      this._update = this._updateTask;
    },

    update: function(app) {
      this._update(app);
    },

    to: function(props, duration, easing) {
      this._add({
        type: 'tween',
        mode: 'to',
        props: props,
        duration: duration,
        easing: easing,
      });
      return this;
    },

    by: function(props, duration, easing) {
      this._add({
        type: 'tween',
        mode: 'by',
        props: props,
        duration: duration,
        easing: easing,
      });

      return this;
    },

    from: function(props, duration, easing) {
      this._add({
        type: 'tween',
        mode: 'from',
        props: props,
        duration: duration,
        easing: easing,
      });
      return this;
    },

    wait: function(time) {
      this._add({
        type: 'wait',
        data: {
          limit: time,
        },
      });
      return this;
    },

    call: function(func, self, args) {
      this._add({
        type: 'call',
        data: {
          func: func,
          self: self || this,
          args: args,
        },
      });
      return this;
    },

    /**
     * プロパティをセット
     * @param {Object} key
     * @param {Object} value
     */
    set: function(key, value) {
      var values = null;
      if (arguments.length == 2) {
        values = {};
        values[key] = value;
      }
      else {
        values = key;
      }
      this._tasks.push({
        type: "set",
        data: {
          values: values
        }
      });

      return this;
    },

    moveTo: function(x, y, duration, easing) {
      return this.to({x:x,y:y}, duration, easing);
    },
    moveBy: function(x, y, duration, easing) {
      return this.by({x:x,y:y}, duration, easing);
    },

    fade: function(value, duration, easing) {
      return this.to({alpha:value}, duration, easing);
    },

    fadeOut: function(duration, easing) {
      return this.fade(0.0, duration, easing)
    },

    fadeIn: function(duration, easing) {
      return this.fade(1.0, duration, easing)
    },

    /**
     * アニメーション開始
     */
    play: function() {
      this.playing = true;
      return this;
    },

    /**
     * アニメーションを一時停止
     */
    pause: function() {
      this.playing = false;
      return this;
    },

    stop: function() {
      this.playing = false;
      this.rewind();
      return this;
    },

    /**
     * アニメーションを巻き戻す
     */
    rewind: function() {
      this._update = this._updateTask;
      this._index = 0;
      this.play();
      return this;
    },

    yoyo: function() {
      // TODO: 最初の値が分からないので反転できない...
      this._update = this._updateTask;
      this._index = 0;
      this._tasks.each(function(task) {
        if (task.type === 'tween') {

        }
      });
      this.play();

      return this;
    },

    /**
     * アニメーションループ設定
     * @param {Boolean} flag
     */
    setLoop: function(flag) {
      this._loop = flag;
      return this;
    },

    /**
     * アニメーションをクリア
     */
    clear: function() {
      this._init();
      return this;
    },

    fromJSON: function(json) {
      if (json.loop !== undefined) {
        this.setLoop(json.loop);
      }

      json.tweens.each(function(t) {
        var t = t.clone();
        var method = t.shift();
        this[method].apply(this, t);
      }, this);

      return this;
    },

    _add: function(params) {
      this._tasks.push(params);
    },

    _updateTask: function(app) {
      if (!this.playing) return ;

      var task = this._tasks[this._index];
      if (!task) {
        if (this._loop) {
          this.rewind();
        }
        else {
          this.playing = false;
        }
        return ;
      }
      else {
        ++this._index;
      }

      if (task.type === 'tween') {
        this._tween = phina.util.Tween();

        if (task.mode === 'to') {
          this._tween.to(this.target, task.props, task.duration, task.easing);
        }
        else if (task.mode === 'by') {
          this._tween.by(this.target, task.props, task.duration, task.easing);
        }
        else {
          this._tween.from(this.target, task.props, task.duration, task.easing);
        }
        this._update = this._updateTween;
        this._update(app);
      }
      else if (task.type === 'wait') {
        this._wait = {
          time: 0,
          limit: task.data.limit,
        };

        this._update = this._updateWait;
        this._update(app);
      }
      else if (task.type === 'call') {
        task.data.func.apply(task.data.self, task.data.args);
        // 1フレーム消費しないよう再帰
        this._update(app);
      }
      else if (task.type === 'set') {
        this.target.$extend(task.data.values);
        // 1フレーム消費しないよう再帰
        this._update(app);
      }
    },

    _updateTween: function(app) {
      var tween = this._tween;
      var time = app.ticker.deltaTime;
      // var time = 1000/app.fps;

      if (tween.time >= tween.duration) {
        delete this._tween;
        this._tween = null;
        this._update = this._updateTask;
      }
      else {
        tween.forward(time);

        this.flare('tween');
      }
    },

    _updateWait: function(app) {
      var wait = this._wait;
      var time = app.ticker.deltaTime;
      wait.time += time;

      if (wait.time >= wait.limit) {
        delete this._wait;
        this._wait = null;
        this._update = this._updateTask;
      }
    },
  });

  phina.app.Element.prototype.getter('tweener', function() {
    if (!this._tweener) {
      this._tweener = phina.accessory.Tweener().attachTo(this);
    }
    return this._tweener;
  });
  
});



phina.namespace(function() {

  phina.define('phina.accessory.Draggable', {
    superClass: 'phina.accessory.Accessory',

    /**
     * @constructor
     */
    init: function(target) {
      this.superInit(target);

      this.initialPosition = phina.geom.Vector2(0, 0);
      var self = this;

      this.on('attached', function() {
        this.target.setInteractive(true);

        this.target.on('pointstart', function(e) {

          self.initialPosition.x = this.x;
          self.initialPosition.y = this.y;
          self.flare('dragstart');
        });
        this.target.on('pointmove', function(e) {
          this.x += e.pointer.dx;
          this.y += e.pointer.dy;
          self.flare('drag');
        });

        this.target.on('pointend', function(e) {
          self.flare('dragend');
        });
      });
    },

    back: function() {
      // TODO: 
      this.target.x = this.initialPosition.x;
      this.target.y = this.initialPosition.y;
      // this.setInteractive(false);
      // this.tweener.clear()
      //     .move(this.initialX, this.initialY, 500, "easeOutElastic")
      //     .call(function () {
      //         this.setInteractive(true);
      //         this.fire(tm.event.Event("backend"));
      //     }.bind(this));
    },

    enable: function() {
      this._enable = true;
    },

  });

  phina.app.Element.prototype.getter('draggable', function() {
    if (!this._draggable) {
      this._draggable = phina.accessory.Draggable().attachTo(this);
    }
    return this._draggable;
  });
  
});
/*
 * frameanimation.js
 */


phina.namespace(function() {

  phina.define('phina.accessory.FrameAnimation', {
    superClass: 'phina.accessory.Accessory',

    /**
     * @constructor
     */
    init: function(ss) {
      this.superInit();

      this.ss = phina.asset.AssetManager.get('spritesheet', ss);
      this.paused = true;
      this.finished = false;
    },

    update: function() {
      if (this.paused) return ;
      if (!this.currentAnimation) return ;

      if (this.finished) {
        this.finished = false;
        this.currentFrameIndex = 0;
        return ;
      }

      ++this.frame;
      if (this.frame%this.currentAnimation.frequency === 0) {
        ++this.currentFrameIndex;
        this._updateFrame();
      }
    },

    gotoAndPlay: function(name) {
      this.frame = 0;
      this.currentFrameIndex = 0;
      this.currentAnimation = this.ss.getAnimation(name);
      this._updateFrame();

      this.paused = false;

      return this;
    },

    gotoAndStop: function(name) {
      this.frame = 0;
      this.currentFrameIndex = 0;
      this.currentAnimation = this.ss.getAnimation(name);
      this._updateFrame();

      this.paused = true;

      return this;
    },

    _updateFrame: function() {
      var anim = this.currentAnimation;
      if (anim) {
        if (this.currentFrameIndex >= anim.frames.length) {
          if (anim.next) {
            this.gotoAndPlay(anim.next);
            return ;
          }
          else {
            this.paused = true;
            this.finished = true;
            return ;
          }
        }
      }

      var index = anim.frames[this.currentFrameIndex];
      var frame = this.ss.getFrame(index);
      var target = this.target;

      target.srcRect.x = frame.x;
      target.srcRect.y = frame.y;
      target.srcRect.width = frame.width;
      target.srcRect.height = frame.height;
      target.width = frame.width;
      target.height = frame.height;
    },
  });
});




(function() {

  if (!phina.global.Event) return ;

  /**
   * @class global.Event
   * 既存のEventオブジェクト拡張
   */
    
  /**
   * @method stop
   * イベントのデフォルト処理 & 伝達を止める
   */
  Event.prototype.stop = function() {
    // イベントキャンセル
    this.preventDefault();
    // イベント伝達を止める
    this.stopPropagation();
  };

})();

(function() {

  if (!phina.global.MouseEvent) return ;

  /**
   * @class global.MouseEvent
   * MouseEvent クラス
   */
  
  /**
   * @method    pointX
   * マウスのX座標.
   */
  MouseEvent.prototype.getter("pointX", function() {
    return this.clientX - this.target.getBoundingClientRect().left;
    // return this.pageX - this.target.getBoundingClientRect().left - window.scrollX;
  });
  
  /**
   * @method    pointY
   * マウスのY座標.
   */
  MouseEvent.prototype.getter("pointY", function() {
    return this.clientY - this.target.getBoundingClientRect().top;
    // return this.pageY - this.target.getBoundingClientRect().top - window.scrollY;
  });
    
})();


(function() {
    
  if (!phina.global.TouchEvent) return ;
  
  
  /**
   * @class global.TouchEvent
   * TouchEvent クラス
   */
  
  /**
   * @method    pointX
   * タッチイベント.
   */
  TouchEvent.prototype.getter("pointX", function() {
      return this.touches[0].clientX - this.target.getBoundingClientRect().left;
      // return this.touches[0].pageX - this.target.getBoundingClientRect().left - tm.global.scrollX;
  });
  
  /**
   * @method    pointY
   * タッチイベント.
   */
  TouchEvent.prototype.getter("pointY", function() {
      return this.touches[0].clientY - this.target.getBoundingClientRect().top;
      // return this.touches[0].pageY - this.target.getBoundingClientRect().top - tm.global.scrollY;
  });  
    
})();


(function() {
    
  if (!phina.global.Touch) return ;
  
  /**
   * @class global.Touch
   * TouchEvent クラス
   */
  
  /**
   * @method    pointX
   * タッチイベント.
   */
  Touch.prototype.getter("pointX", function() {
      return this.clientX - this.target.getBoundingClientRect().left;
  });

  /**
   * @method    pointY
   * タッチイベント.
   */
  Touch.prototype.getter("pointY", function() {
      return this.clientY - this.target.getBoundingClientRect().top;
  });
    
})();


phina.namespace(function() {

  /**
   * @class phina.graphics.Canvas
   * キャンバス拡張クラス
   */
  phina.define('phina.graphics.Canvas', {
    domElement: null,
    canvas: null,
    context: null,

    /**
     * 初期化
     */
    init: function(canvas) {
      if (typeof canvas === 'string') {
        this.canvas = document.querySelector(canvas);
      }
      else {
        this.canvas = canvas || document.createElement('canvas');
      }

      this.domElement = this.canvas;
      this.context = this.canvas.getContext('2d');
      this.context.lineCap = 'round';
      this.context.lineJoin = 'round';
    },

    /**
     * サイズをセット
     */
    setSize: function(width, height) {
      this.canvas.width   = width;
      this.canvas.height  = height;
      return this;
    },

    setSizeToScreen: function() {
      this.canvas.style.position  = "fixed";
      this.canvas.style.margin    = "0px";
      this.canvas.style.padding   = "0px";
      this.canvas.style.left      = "0px";
      this.canvas.style.top       = "0px";
      return this.setSize(window.innerWidth, window.innerHeight);
    },

    fitScreen: function(isEver) {
      isEver = isEver === undefined ? true : isEver;

      var _fitFunc = function() {
        var e = this.domElement;
        var s = e.style;
        
        s.position = "absolute";
        s.margin = "auto";
        s.left = "0px";
        s.top  = "0px";
        s.bottom = "0px";
        s.right = "0px";

        var rateWidth = e.width/window.innerWidth;
        var rateHeight= e.height/window.innerHeight;
        var rate = e.height/e.width;
        
        if (rateWidth > rateHeight) {
          s.width  = Math.floor(innerWidth)+"px";
          s.height = Math.floor(innerWidth*rate)+"px";
        }
        else {
          s.width  = Math.floor(innerHeight/rate)+"px";
          s.height = Math.floor(innerHeight)+"px";
        }
      }.bind(this);
      
      // 一度実行しておく
      _fitFunc();

      // リサイズ時のリスナとして登録しておく
      if (isEver) {
        window.addEventListener("resize", _fitFunc, false);
      }
    },

    /**
     * クリア
     */
    clear: function(x, y, width, height) {
      x = x || 0;
      y = y || 0;
      width = width || this.width;
      height= height|| this.height;
      this.context.clearRect(x, y, width, height);
      return this;
    },

    clearColor: function(fillStyle, x, y, width, height) {
      x = x || 0;
      y = y || 0;
      width = width || this.width;
      height= height|| this.height;

      var context = this.context;

      context.save();
      context.setTransform(1.0, 0.0, 0.0, 1.0, 0.0, 0.0); // 行列初期化
      context.fillStyle = fillStyle;     // 塗りつぶしスタイルセット
      context.fillRect(x, y, width, height);
      context.restore();

      return this;
    },


    /**
     * パスを開始(リセット)
     */
    beginPath: function() {
      this.context.beginPath();
      return this;
    },

    /**
     *  パスを閉じる
     */
    closePath: function() {
      this.context.closePath();
      return this;
    },


    /**
     *  新規パス生成
     */
    moveTo: function(x, y) {
      this.context.moveTo(x, y);
      return this;
    },

    /**
     * パスに追加
     */
    lineTo: function(x, y) {
      this.context.lineTo(x, y);
      return this;
    },

    /**
     * パス内を塗りつぶす
     */
    fill: function() {
      this.context.fill();
      return this;
    },

    /**
     * パス上にラインを引く
     */
    stroke: function() {
      this.context.stroke();
      return this;
    },

    /**
     * クリップ
     */
    clip: function() {
      this.context.clip();
      return this;
    },

        
    /**
     * 点描画
     */
    drawPoint: function(x, y) {
      return this.strokeRect(x, y, 1, 1);
    },

    /**
     * ラインパスを作成
     */
    line: function(x0, y0, x1, y1) {
      return this.moveTo(x0, y0).lineTo(x1, y1);
    },
    
    /**
     * ラインを描画
     */
    drawLine: function(x0, y0, x1, y1) {
      return this.beginPath().line(x0, y0, x1, y1).stroke();
    },

    /**
     * ダッシュラインを描画
     */
    drawDashLine: function(x0, y0, x1, y1, pattern) {
      var patternTable = null;
      if (typeof(pattern) == "string") {
        patternTable = pattern;
      }
      else {
        pattern = pattern || 0xf0f0;
        patternTable = pattern.toString(2);
      }
      patternTable = patternTable.padding(16, '1');
      
      var vx = x1-x0;
      var vy = y1-y0;
      var len = Math.sqrt(vx*vx + vy*vy);
      vx/=len; vy/=len;
      
      var x = x0;
      var y = y0;
      for (var i=0; i<len; ++i) {
        if (patternTable[i%16] == '1') {
          this.drawPoint(x, y);
          // this.fillRect(x, y, this.context.lineWidth, this.context.lineWidth);
        }
        x += vx;
        y += vy;
      }
      
      return this;
    },

    /**
     * v0(x0, y0), v1(x1, y1) から角度を求めて矢印を描画
     * http://hakuhin.jp/as/rotation.html
     */
    drawArrow: function(x0, y0, x1, y1, arrowRadius) {
      var vx = x1-x0;
      var vy = y1-y0;
      var angle = Math.atan2(vy, vx)*180/Math.PI;
      
      this.drawLine(x0, y0, x1, y1);
      this.fillPolygon(x1, y1, arrowRadius || 5, 3, angle);
      
      return this;
    },


    /**
     * lines
     */
    lines: function() {
      this.moveTo(arguments[0], arguments[1]);
      for (var i=1,len=arguments.length/2; i<len; ++i) {
        this.lineTo(arguments[i*2], arguments[i*2+1]);
      }
      return this;
    },

    /**
     * ラインストローク描画
     */
    strokeLines: function() {
      this.beginPath();
      this.lines.apply(this, arguments);
      this.stroke();
      return this;
    },

    /**
     * ライン塗りつぶし描画
     */
    fillLines: function() {
      this.beginPath();
      this.lines.apply(this, arguments);
      this.fill();
      return this;
    },
    
    /**
     * 四角形パスを作成する
     */
    rect: function(x, y, width, height) {
      this.context.rect.apply(this.context, arguments);
      return this;
    },
    
    /**
     * 四角形塗りつぶし描画
     */
    fillRect: function() {
      this.context.fillRect.apply(this.context, arguments);
      return this;
    },
    
    /**
     * 四角形ライン描画
     */
    strokeRect: function() {
      this.context.strokeRect.apply(this.context, arguments);
      return this;
    },
    
    /**
     * 角丸四角形パス
     */
    roundRect: function(x, y, width, height, radius) {
      var l = x + radius;
      var r = x + width - radius;
      var t = y + radius;
      var b = y + height - radius;
      
      /*
      var ctx = this.context;
      ctx.moveTo(l, y);
      ctx.lineTo(r, y);
      ctx.quadraticCurveTo(x+width, y, x+width, t);
      ctx.lineTo(x+width, b);
      ctx.quadraticCurveTo(x+width, y+height, r, y+height);
      ctx.lineTo(l, y+height);
      ctx.quadraticCurveTo(x, y+height, x, b);
      ctx.lineTo(x, t);
      ctx.quadraticCurveTo(x, y, l, y);
      /**/
      
      this.context.arc(l, t, radius,     -Math.PI, -Math.PI*0.5, false);  // 左上
      this.context.arc(r, t, radius, -Math.PI*0.5,            0, false);  // 右上
      this.context.arc(r, b, radius,            0,  Math.PI*0.5, false);  // 右下
      this.context.arc(l, b, radius,  Math.PI*0.5,      Math.PI, false);  // 左下
      this.closePath();
      
      return this;
    },

    /**
     * 角丸四角形塗りつぶし
     */
    fillRoundRect: function(x, y, width, height, radius) {
      return this.beginPath().roundRect(x, y, width, height, radius).fill();
    },

    /**
     * 角丸四角形ストローク描画
     */
    strokeRoundRect: function(x, y, width, height, radius) {
      return this.beginPath().roundRect(x, y, width, height, radius).stroke();
    },

    /**
     * 円のパスを設定
     */
    circle: function(x, y, radius) {
      this.context.arc(x, y, radius, 0, Math.PI*2, false);
      return this;
    },
    
    /**
     * 塗りつぶし円を描画
     */
    fillCircle: function(x, y, radius) {
      var c = this.context;
      c.beginPath();
      c.arc(x, y, radius, 0, Math.PI*2, false);
      c.closePath();
      c.fill();
      return this;
    },
    
    /**
     * ストローク円を描画
     */
    strokeCircle: function(x, y, radius) {
      var c = this.context;
      c.beginPath();
      c.arc(x, y, radius, 0, Math.PI*2, false);
      c.closePath();
      c.stroke();
      return this;
    },

    /**
     * 円弧のパスを設定
     */
    arc: function(x, y, radius, startAngle, endAngle, anticlockwise) {
      this.context.arc(x, y, radius, startAngle, endAngle, anticlockwise);
      return this;
    },
    
    /**
     * 塗りつぶし円弧を描画
     */
    fillArc: function(x, y, radius, startAngle, endAngle, anticlockwise) {
      return this.beginPath().arc(x, y, radius, startAngle, endAngle, anticlockwise).fill();
    },
    
    /**
     * ストローク円弧を描画
     */
    strokeArc: function(x, y, radius, startAngle, endAngle, anticlockwise) {
      return this.beginPath().arc(x, y, radius, startAngle, endAngle, anticlockwise).stroke();
    },


    pie: function(x, y, radius, startAngle, endAngle, anticlockwise) {
      var context = this.context;
      context.beginPath();
      context.moveTo(0, 0);
      context.arc(x, y, radius, startAngle-Math.PI/2, endAngle-Math.PI/2, anticlockwise);
      context.closePath();
      return this;
    },
    fillPie: function(x, y, radius, startAngle, endAngle, anticlockwise) {
      return this.beginPath().pie(x, y, radius, startAngle, endAngle, anticlockwise).fill();
    },
    strokePie: function(x, y, radius, startAngle, endAngle, anticlockwise) {
      return this.beginPath().pie(x, y, radius, startAngle, endAngle, anticlockwise).stroke();
    },

    
    /**
     * ポリゴンパス
     */
    polygon: function(x, y, size, sides, offsetAngle) {
      var radDiv = (Math.PI*2)/sides;
      var radOffset = (offsetAngle!=undefined) ? offsetAngle*Math.PI/180 : -Math.PI/2;
      
      this.moveTo(x + Math.cos(radOffset)*size, y + Math.sin(radOffset)*size);
      for (var i=1; i<sides; ++i) {
        var rad = radDiv*i+radOffset;
        this.lineTo(
          x + Math.cos(rad)*size,
          y + Math.sin(rad)*size
        );
      }
      this.closePath();
      return this;
    },
    /**
     * ポリゴン塗りつぶし
     */
    fillPolygon: function(x, y, radius, sides, offsetAngle) {
      return this.beginPath().polygon(x, y, radius, sides, offsetAngle).fill();
    },
    /**
     * ポリゴンストローク描画
     */
    strokePolygon: function(x, y, radius, sides, offsetAngle) {
      return this.beginPath().polygon(x, y, radius, sides, offsetAngle).stroke();
    },
    
    /**
     * star
     */
    star: function(x, y, radius, sides, sideIndent, offsetAngle) {
      var x = x || 0;
      var y = y || 0;
      var radius = radius || 64;
      var sides = sides || 5;
      var sideIndentRadius = radius * (sideIndent || 0.38);
      var radOffset = (offsetAngle) ? offsetAngle*Math.PI/180 : -Math.PI/2;
      var radDiv = (Math.PI*2)/sides/2;

      this.moveTo(
        x + Math.cos(radOffset)*radius,
        y + Math.sin(radOffset)*radius
      );
      for (var i=1; i<sides*2; ++i) {
        var rad = radDiv*i + radOffset;
        var len = (i%2) ? sideIndentRadius : radius;
        this.lineTo(
          x + Math.cos(rad)*len,
          y + Math.sin(rad)*len
        );
      }
      this.closePath();

      return this;
    },

    /**
     * 星を塗りつぶし描画
     */
    fillStar: function(x, y, radius, sides, sideIndent, offsetAngle) {
      this.beginPath().star(x, y, radius, sides, sideIndent, offsetAngle).fill();
      return this;
    },

    /**
     * 星をストローク描画
     */
    strokeStar: function(x, y, radius, sides, sideIndent, offsetAngle) {
      this.beginPath().star(x, y, radius, sides, sideIndent, offsetAngle).stroke();
      return this;
    },

    /**
     * 行列をセット
     */
    setTransform: function(m11, m12, m21, m22, dx, dy) {
      this.context.setTransform(m11, m12, m21, m22, dx, dy);
      return this;
    },

    /**
     * 行列をリセット
     */
    resetTransform: function() {
      this.setTransform(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
      return this;
    },
    /**
     * 中心に移動
     */
    transformCenter: function() {
      this.context.setTransform(1, 0, 0, 1, this.width/2, this.height/2);
      return this;
    },

    /**
     * 移動
     */
    translate: function(x, y) {
      this.context.translate(x, y);
      return this;
    },
    
    /**
     * 回転
     */
    rotate: function(rotation) {
      this.context.rotate(rotation);
      return this;
    },
    
    /**
     * スケール
     */
    scale: function(scaleX, scaleY) {
      this.context.scale(scaleX, scaleY);
      return this;
    },

    /**
     * 画像として保存
     */
    saveAsImage: function(mime_type) {
      mime_type = mime_type || "image/png";
      var data_url = this.canvas.toDataURL(mime_type);
      // data_url = data_url.replace(mime_type, "image/octet-stream");
      window.open(data_url, "save");
      
      // toDataURL を使えば下記のようなツールが作れるかも!!
      // TODO: プログラムで絵をかいて保存できるツール
    },


    _accessor: {
      /**
       * 幅
       */
      width: {
        "get": function()   { return this.canvas.width; },
        "set": function(v)  { this.canvas.width = v; }
      },

      /**
       * 高さ
       */
      height: {
        "get": function()   { return this.canvas.height; },
        "set": function(v)  { this.canvas.height = v; }
      },

      fillStyle: {
        "get": function()   { return this.context.fillStyle; },
        "set": function(v)  { this.context.fillStyle = v; }
      },

      strokeStyle: {
        "get": function()   { return this.context.strokeStyle; },
        "set": function(v)  { this.context.strokeStyle = v; }
      },
    },

    _static: {
      dummyCanvas: (function() {
        if (!phina.isNode()) {
          return document.createElement('canvas');
        }
        else {
          return null;
        }
      })(),
    },
  });
});

/*
 *
 */


phina.namespace(function() {

  /**
   * @class phina.graphics.CanvasRecorder
   * 
   */
  phina.define('phina.graphics.CanvasRecorder', {

    superClass: 'phina.util.EventDispatcher',

    init: function(canvas) {
      this.superInit();

      this.canvas = canvas;

      this.gif = new GIF({
        workers: 4,
        quality: 10,
        width: canvas.width,
        height: canvas.height,
      });
    },

    start: function() {
      var frameTime = 33;
      var time = 0;
      var id = setInterval(function() {
        time+=frameTime;

        console.log(time);

        if (time > 3000) {
          clearInterval(id);
        }
      }, frameTime);

      return this;
    },

    stop: function() {

    },

    open: function() {

    },
  });

});


phina.namespace(function() {

  /**
   * @class phina.display.CanvasElement
   * 
   */
  phina.define('phina.display.CanvasElement', {
    superClass: 'phina.app.Object2D',

    /** 表示フラグ */
    visible: true,

    /** 子供を CanvasRenderer で描画するか */
    childrenVisible: true,

    init: function(options) {
      options = (options || {});
      
      this.superInit();

      this.visible = true;
      this.alpha = 1.0;
      this._worldAlpha = 1.0;

      this.width = options.width || 64;
      this.height = options.height || 64;
    },

    /**
     * 表示/非表示をセット
     */
    setVisible: function(flag) {
      this.visible = flag;
      return this;
    },

    /**
     * 表示
     */
    show: function() {
      this.visible = true;
      return this;
    },

    /**
     * 非表示
     */
    hide: function() {
      this.visible = false;
      return this;
    },

    /**
     * @private
     */
    _calcWorldAlpha: function() {
      if (!this.parent) {
        this._worldAlpha = this.alpha;
        return ;
      }
      else {
        var worldAlpha = (this.parent._worldAlpha !== undefined) ? this.parent._worldAlpha : 1.0; 
        // alpha
        this._worldAlpha = worldAlpha * this.alpha;
      }
    },
  });

});



phina.namespace(function() {

  /**
   * @class phina.display.Shape
   * 
   */
  phina.define('phina.display.Shape', {
    superClass: 'phina.display.CanvasElement',

    init: function(options) {
      options = (options || {}).$safe({
        width: 64,
        height: 64,
        padding: 8,

        backgroundColor: '#aaa',
        fill: '#00a',
        stroke: '#aaa',
        strokeWidth: 4,

        shadow: false,
        shadowBlur: 4,
      });
      this.superInit(options);

      this.padding = options.padding;

      this.backgroundColor = options.backgroundColor;
      this.fill = options.fill;
      this.stroke = options.stroke;
      this.strokeWidth = options.strokeWidth;
      
      this.shadow = options.shadow;
      this.shadowBlur = options.shadowBlur;

      this.canvas = phina.graphics.Canvas();
      this._dirtyDraw = true;

      this.on('enterframe', function() {
        if (this._dirtyDraw === true) {
          this._render();
          this._dirtyDraw = false;
        }
      });
    },

    _render: function() {
      this.canvas.width = this.width + this.padding*2;
      this.canvas.height= this.height + this.padding*2;

      this.canvas.clearColor(this.backgroundColor);
    },

    draw: function(canvas) {
      var image = this.canvas.domElement;
      var w = image.width;
      var h = image.height;
      canvas.context.drawImage(image,
        0, 0, w, h,
        -w*this.origin.x, -h*this.origin.y, w, h
        );
    },

    _accessor: {
      width: {
        get: function() {
          return this._width;
        },
        set: function(v) {
          this._dirtyDraw = true; this._width = v;
        },
      },
      height: {
        get: function() {
          return this._height;
        },
        set: function(v) {
          this._dirtyDraw = true; this._height = v;
        },
      },
      padding: {
        get: function() {
          return this._padding;
        },
        set: function(v) {
          this._dirtyDraw = true; this._padding = v;
        },
      },
      backgroundColor: {
        get: function() {
          return this._backgroundColor;
        },
        set: function(v) {
          this._dirtyDraw = true;
          this._backgroundColor = v;
        },
      },
      fill: {
        get: function() {
          return this._fill;
        },
        set: function(v) {
          this._dirtyDraw = true;
          this._fill = v;
        },
      },
      stroke: {
        get: function() {
          return this._stroke;
        },
        set: function(v) {
          this._dirtyDraw = true;
          this._stroke = v;
        },
      },
      strokeWidth: {
        get: function() {
          return this._strokeWidth;
        },
        set: function(v) {
          this._dirtyDraw = true;
          this._strokeWidth = v;
        },
      },
      shadow: {
        get: function() {
          return this._shadow;
        },
        set: function(v) {
          this._dirtyDraw = true;
          this._shadow = v;
        },
      },
      shadowBlur: {
        get: function() {
          return this._shadowBlur;
        },
        set: function(v) {
          this._dirtyDraw = true;
          this._shadowBlur = v;
        },
      },
    },
  });

  /**
   * @class phina.display.RectangleShape
   * 
   */
  phina.define('phina.display.RectangleShape', {
    superClass: 'phina.display.Shape',
    init: function(options) {

      options = (options || {}).$safe({
        backgroundColor: 'transparent',
        fill: 'blue',
        stroke: '#aaa',
        strokeWidth: 4,

        cornerRadius: 0,
      });
      this.superInit(options);

      this.cornerRadius = options.cornerRadius;
    },

    _render: function() {
      this.canvas.width = this.width + this.padding*2;
      this.canvas.height= this.height + this.padding*2;
      this.canvas.clearColor(this.backgroundColor);

      this.canvas.transformCenter();

      if (this.stroke) {
        this.canvas.context.lineWidth = this.strokeWidth;
        this.canvas.strokeStyle = this.stroke;
        this.canvas.strokeRoundRect(-this.width/2, -this.height/2, this.width, this.height, this.cornerRadius);
      }

      this.canvas.context.fillStyle = this.fill;
      this.canvas.fillRoundRect(-this.width/2, -this.height/2, this.width, this.height, this.cornerRadius);
    },

    _accessor: {
      cornerRadius: {
        get: function() {
          return this._cornerRadius;
        },
        set: function(v) {
          this._dirtyDraw = true; this._cornerRadius = v;
        },
      }
    },

  });

  /**
   * @class phina.display.Shape
   * 
   */
  phina.define('phina.display.CircleShape', {
    superClass: 'phina.display.Shape',
    init: function(options) {
      options = (options || {}).$safe({
        backgroundColor: 'transparent',
        fill: 'red',
        stroke: '#aaa',
        strokeWidth: 4,

        radius: 32,
      });
      this.superInit(options);

      this.radius = options.radius;
    },

    _render: function() {
      this.canvas.width = this.radius*2 + this.padding*2;
      this.canvas.height= this.radius*2 + this.padding*2;
      this.canvas.clearColor(this.backgroundColor);

      this.canvas.transformCenter();

      if (this.stroke) {
        this.canvas.context.lineWidth = this.strokeWidth;
        this.canvas.strokeStyle = this.stroke;
        this.canvas.strokeCircle(0, 0, this.radius);
      }

      this.canvas.context.fillStyle = this.fill;
      this.canvas.fillCircle(0, 0, this.radius);
    },

    _accessor: {
      radius: {
        get: function() {
          return this._radius;
        },
        set: function(v) {
          this._dirtyDraw = true; this._radius = v;
        },
      }
    },
  });

});



phina.namespace(function() {

  /**
   * @class phina.display.Sprite
   * 
   */
  phina.define('phina.display.Sprite', {
    superClass: 'phina.display.CanvasElement',

    init: function(image, width, height) {
      this.superInit();

      if (typeof image === 'string') {
        image = phina.asset.AssetManager.get('image', image);
      }
      
      this.image = image;
      this.width = width || this.image.domElement.width;
      this.height = height || this.image.domElement.height;
      this._frameIndex = 0;

      this.srcRect = {
        x: 0,
        y: 0,
        width: this.width,
        height: this.height,
      };
    },

    draw: function(canvas) {
      var image = this.image.domElement;


      // canvas.context.drawImage(image,
      //   0, 0, image.width, image.height,
      //   -this.width*this.origin.x, -this.height*this.origin.y, this.width, this.height
      //   );

      var srcRect = this.srcRect;
      canvas.context.drawImage(image,
        srcRect.x, srcRect.y, srcRect.width, srcRect.height,
        -this.width*this.originX, -this.height*this.originY, this.width, this.height
        );
    },

    setFrameIndex: function(index, width, height) {
      var tw  = width || this.width;      // tw
      var th  = height || this.height;    // th
      var row = ~~(this.image.domElement.width / tw);
      var col = ~~(this.image.domElement.height / th);
      var maxIndex = row*col;
      index = index%maxIndex;
      
      var x   = index%row;
      var y   = ~~(index/row);
      this.srcRect.x = x*tw;
      this.srcRect.y = y*th;
      this.srcRect.width  = tw;
      this.srcRect.height = th;

      this._frameIndex = index;

      return this;
    },

    _accessor: {
      frameIndex: {
        get: function() {return this._frameIndex;},
        set: function(idx) {
          this.setFrameIndex(idx);
          return this;
        }
      },
    },
  });

});



phina.namespace(function() {

  /**
   * @class phina.display.Label
   * 
   */
  phina.define('phina.display.Label', {
    superClass: 'phina.display.Shape',

    init: function(options) {
      if (typeof arguments[0] === 'string') {
        options = { text: arguments[0], };
      }
      else {
        options = arguments[0];
      }

      options = (options || {}).$safe({
        backgroundColor: 'transparent',

        fill: 'black',
        stroke: '#222',
        strokeWidth: 2,

        // 
        text: 'Hello, world!',
        // 
        fontSize: 32,
        fontWeight: '',
        fontFamily: "'HiraKakuProN-W3'", // Hiragino or Helvetica,
        // 
        align: 'center',
        baseline: 'middle',
        lineHeight: 1.2,
      });

      this.superInit(options);

      this.text = options.text;
      this.fontSize = options.fontSize;
      this.fontWeight = options.fontWeight;
      this.fontFamily = options.fontFamily;
      this.align = options.align;
      this.baseline = options.baseline;
      this.lineHeight = options.lineHeight;
    },

    calcWidth: function() {
      var width = 0;
      var canvas = this.canvas;
      this._lines.forEach(function(line) {
        var w = canvas.context.measureText(line).width;
        if (width < w) {
          width = w;
        }
      }, this);
      if (this.align !== 'center') width*=2;
      return width;
    },

    calcHeight: function() {
      var height = this.fontSize * this._lines.length;
      if (this.baseline !== 'middle') height*=2;
      return height*this.lineHeight;
    },

    _render: function() {
      var canvas = this.canvas;
      var context = canvas.context;

      var fontSize = this.fontSize;
      var font = "{fontWeight} {fontSize}px {fontFamily}".format(this);
      var lines = this._lines = this.text.split('\n');
      canvas.context.font = font;

      canvas.width = this.calcWidth() + this.padding*2;
      canvas.height = this.calcHeight() + this.padding*2;
      canvas.clearColor(this.backgroundColor);

      canvas.transformCenter();
      context.font = font;
      context.textAlign = this.align;
      context.textBaseline = this.baseline;

      context.fillStyle = this.fill;
      context.strokeStyle = this.stroke;
      context.lineWidth = this.strokeWidth;

      context.lineJoin = "round";

      var lineSize = fontSize*this.lineHeight;
      var offset = -Math.floor(lines.length/2)*lineSize;
      offset += ((lines.length+1)%2) * (lineSize/2);

      if (this.stroke) {
        context.shadowBlur = 0;
        lines.forEach(function(line, i) {
          context.strokeText(line, 0, i*lineSize+offset);
        }, this);
      }

      if (this.shadow) {
        context.shadowColor = this.shadow;
        context.shadowBlur = this.shadowBlur;
      }
      lines.forEach(function(line, i) {
        context.fillText(line, 0, i*lineSize+offset);
      }, this);
    },

    _accessor: {
      text: {
        get: function() { return this._text; },
        set: function(v) { this._dirtyDraw = true; this._text = v; },
      },
      fontSize: {
        get: function() { return this._fontSize; },
        set: function(v) { this._dirtyDraw = true; this._fontSize = v; },
      },
      fontWeight: {
        get: function() { return this._fontWeight; },
        set: function(v) { this._dirtyDraw = true; this._fontWeight = v; },
      },
      fontFamily: {
        get: function() { return this._fontFamily; },
        set: function(v) { this._dirtyDraw = true; this._fontFamily = v; },
      },
      align: {
        get: function() { return this._align; },
        set: function(v) { this._dirtyDraw = true; this._align = v; },
      },
      baseline: {
        get: function() { return this._baseline; },
        set: function(v) { this._dirtyDraw = true; this._baseline = v; },
      },
      lineHeight: {
        get: function() { return this._lineHeight; },
        set: function(v) { this._dirtyDraw = true; this._lineHeight = v; },
      },
    }
  });

});



phina.namespace(function() {

  /**
   * @class
   */
  phina.define('phina.display.CanvasScene', {
    superClass: 'phina.app.Scene',

    init: function(params) {
      this.superInit();

      params = (params || {}).$safe(phina.display.CanvasScene.default);

      this.canvas = phina.graphics.Canvas();
      this.canvas.setSize(params.width, params.height);
      this.renderer = phina.display.CanvasRenderer(this.canvas);
      this.backgroundColor = (params.backgroundColor) ? params.backgroundColor : null;
      
      this.width = params.width;
      this.height = params.height;
      this.gridX = phina.util.Grid(params.width, 16);
      this.gridY = phina.util.Grid(params.height, 16);

      // TODO: 一旦むりやり対応
      this.interactive = true;
      this._overFlags = {};
      this._touchFlags = {};
    },

    hitTest: function() {
      return true;
    },

    _update: function() {
      if (this.update) {
        this.update();
      }
    },

    _render: function() {
      this.renderer.render(this);
    },

    _static: {
      default: {
        width: 640,
        height: 960,
      },
    }

  });


});


phina.namespace(function() {

  /**
   * @class
   */
  phina.define('phina.display.Layer', {
    superClass: 'phina.display.CanvasElement',

    /** 子供を CanvasRenderer で描画するか */
    childrenVisible: false,

    init: function(params) {
      this.superInit(params);
      this.canvas = phina.graphics.Canvas();
      params = (params || {}).$safe({
        width: 640,
        height: 960,
      });
      this.width = this.canvas.width  = params.width;
      this.height = this.canvas.height = params.height;

      this.renderer = phina.display.CanvasRenderer(this.canvas);
    },

    draw: function(canvas) {
      var temp = this._worldMatrix;
      this._worldMatrix = null;
      this.renderer.render(this);
      this._worldMatrix = temp;

      var image = this.canvas.domElement;
      canvas.context.drawImage(image,
        0, 0, image.width, image.height,
        -this.width*this.originX, -this.height*this.originY, this.width, this.height
        );
    },
  });
});

phina.namespace(function() {

  /**
   * @class
   */
  phina.define('phina.display.ThreeLayer', {
    superClass: 'phina.display.CanvasElement',

    scene: null,
    camera: null,
    light: null,
    renderer: null,

    /** 子供を CanvasRenderer で描画するか */
    childrenVisible: false,

    init: function(params) {
      this.superInit();

      this.scene = new THREE.Scene();

      this.camera = new THREE.PerspectiveCamera( 75, params.width / params.height, 1, 10000 );
      this.camera.position.z = 1000;

      this.light = new THREE.DirectionalLight( 0xffffff, 1 );
      this.light.position.set( 1, 1, 1 ).normalize();
      this.scene.add( this.light );

      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setClearColor( 0xf0f0f0 );
      this.renderer.setSize( params.width, params.height );

      this.on('enterframe', function() {
        this.renderer.render( this.scene, this.camera );
      });
    },

    draw: function(canvas) {
      var domElement = this.renderer.domElement;
      canvas.context.drawImage(domElement, 0, 0, domElement.width, domElement.height);
    },
  });
});




phina.namespace(function() {
  
  phina.define('phina.display.CanvasRenderer', {

    init: function(canvas) {
      this.canvas = canvas;
      this._context = this.canvas.context;
    },
    render: function(scene) {
      if (scene.backgroundColor) {
        this.canvas.clearColor(scene.backgroundColor);
      }
      else {
        this.canvas.clear();
      }
      
      this._context.save();
      this.renderChildren(scene);
      this._context.restore();
    },
    
    renderChildren: function(obj) {
      // 子供たちも実行
      if (obj.children.length > 0) {
        var tempChildren = obj.children.slice();
        for (var i=0,len=tempChildren.length; i<len; ++i) {
          this.renderObject(tempChildren[i]);
        }
      }
    },

    renderObject: function(obj) {
      if (obj.visible === false) return ;

      obj._calcWorldMatrix && obj._calcWorldMatrix();
      obj._calcWorldAlpha && obj._calcWorldAlpha();

      var context = this.canvas.context;

      context.globalAlpha = obj._worldAlpha;

      if (obj._worldMatrix) {
        // 行列をセット
        var m = obj._worldMatrix;
        context.setTransform( m.m00, m.m10, m.m01, m.m11, m.m02, m.m12 );
      }

      if (obj.clip) {

        context.save();

        obj.clip(this.canvas);
        context.clip();

        if (obj.draw) obj.draw(this.canvas);

        // 子供たちも実行
        if (obj.childrenVisible && obj.children.length > 0) {
            var tempChildren = obj.children.slice();
            for (var i=0,len=tempChildren.length; i<len; ++i) {
                this.renderObject(tempChildren[i]);
            }
        }

        context.restore();
      }
      else {
        if (obj.draw) obj.draw(this.canvas);

        // 子供たちも実行
        if (obj.childrenVisible && obj.children.length > 0) {
          var tempChildren = obj.children.slice();
          for (var i=0,len=tempChildren.length; i<len; ++i) {
            this.renderObject(tempChildren[i]);
          }
        }

      }
    },

  });

});

phina.namespace(function() {

  /**
   * @class phina.display.DomApp
   * @extends phina.app.BaseApp
   */
  phina.define('phina.display.DomApp', {
    superClass: 'phina.app.BaseApp',

    domElement: null,

    /**
     * @constructor
     */
    init: function(options) {
      this.superInit(options);

      if (options.domElement) {
        this.domElement = options.domElement;
      }
      else {
        if (options.query) {
          this.domElement = document.querySelector(options.query);
        }
        else {
          console.assert('error');
        }
      }

      this.mouse = phina.input.Mouse(this.domElement);
      this.touch = phina.input.Touch(this.domElement);
      this.touchList = phina.input.TouchList(this.domElement, 5);
      this.keyboard = phina.input.Keyboard(document);

      // ポインタをセット(PC では Mouse, Mobile では Touch)
      this.pointer = this.touch;
      this.pointers = this.touchList.touches;

      this.domElement.addEventListener("touchstart", function () {
        this.pointer = this.touch;
        this.pointers = this.touchList.touches;
      }.bind(this));
      this.domElement.addEventListener("mousedown", function () {
        this.pointer = this.mouse;
        this.pointers = [this.mouse];
      }.bind(this));

      // keyboard event
      this.keyboard.on('keydown', function(e) {
        this.currentScene && this.currentScene.flare('keydown', {
          keyCode: e.keyCode,
        });
      }.bind(this));
      this.keyboard.on('keyup', function(e) {
        this.currentScene && this.currentScene.flare('keyup', {
          keyCode: e.keyCode,
        });
      }.bind(this));
      this.keyboard.on('keypress', function(e) {
        this.currentScene && this.currentScene.flare('keypress', {
          keyCode: e.keyCode,
        });
      }.bind(this));

      // click 対応
      var eventName = phina.isMobile() ? 'touchend' : 'mouseup';
      this.domElement.addEventListener(eventName, this._checkClick.bind(this));

      // 決定時の処理をオフにする(iPhone 時のちらつき対策)
      this.domElement.addEventListener("touchstart", function(e) { e.stop(); });
      this.domElement.addEventListener("touchmove", function(e) { e.stop(); });
    },

    update: function() {
      this.mouse.update();
      this.touch.update();
      this.touchList.update();
      this.keyboard.update();
    },

    _checkClick: function(e) {
      var _check = function(element) {
        if (element.children.length > 0) {
          element.children.each(function(child) {
            _check(child);
          });
        }
        if (element._clicked && element.has('click')) {
          element.flare('click');
        }
        element._clicked = false;
      };

      _check(this.currentScene);
    },

  });

  
});


phina.namespace(function() {

  /**
   * @class phina.display.CanvasApp
   * 
   */
  phina.define('phina.display.CanvasApp', {
    superClass: 'phina.display.DomApp',

    /**
     * @constructor
     */
    init: function(options) {
      options.$safe({
        width: 640,
        height: 960,
        columns: 12,
        fit: true,
      });
      
      if (!options.query && !options.domElement) {
        options.domElement = document.createElement('canvas');
      }
      this.superInit(options);


      this.gridX = phina.util.Grid({
        width: options.width,
        columns: options.columns,
      });
      this.gridY = phina.util.Grid({
        width: options.height,
        columns: options.columns,
      });

      this.canvas = phina.graphics.Canvas(this.domElement);
      this.canvas.setSize(options.width, options.height);

      this.backgroundColor = 'white';

      this.replaceScene(phina.display.CanvasScene({
        width: options.width,
        height: options.height,
      }));

      if (options.fit) {
        this.fitScreen();
      }

      // pushScene, popScene 対策
      this.on('push', function() {
        // onenter 対策で描画しておく
        this._draw();
      });
    },

    _draw: function() {
      if (this.backgroundColor) {
        this.canvas.clearColor(this.backgroundColor);
      } else {
        this.canvas.clear();
      }

      if (this.currentScene.canvas) {
        this.currentScene._render();

        this._scenes.each(function(scene) {
          var c = scene.canvas;
          if (c) {
            this.canvas.context.drawImage(c.domElement, 0, 0, c.width, c.height);
          }
        }, this);
      }
    },

    fitScreen: function() {
      this.canvas.fitScreen();
    },

  });
});


phina.namespace(function() {

  /**
   * @class phina.effect.Wave
   * Button
   */
  phina.define('phina.effect.Wave', {
    superClass: 'phina.display.CircleShape',
    /**
     * @constructor
     */
    init: function(params) {
      this.superInit({
      	fill: 'white',
      	stroke: false,
      });

      var tweener = phina.accessory.Tweener().attachTo(this);
      tweener
        .to({scaleX:2, scaleY:2, alpha:0}, 500)
        .call(function() {
          this.remove();
        }, this);
    },
  });

});




phina.namespace(function() {

  /**
   * @class phina.ui.Button
   * Button
   */
  phina.define('phina.ui.BaseButton', {
    superClass: 'phina.display.CanvasElement',
    /**
     * @constructor
     */
    init: function(params) {
      this.superInit();

      params = (params || {}).$safe({
        width: 200,
        height: 80,
      });

      this.width = params.width;
      this.height = params.height;

      this.setInteractive(true);

      this.on('pointend', function() {
        this.flare('push');
      });
    },
  });

});

phina.namespace(function() {

  /**
   * @class phina.ui.Button
   * Button
   */
  phina.define('phina.ui.Button', {
    superClass: 'phina.ui.BaseButton',
    /**
     * @constructor
     */
    init: function(params) {
      this.superInit(params);

      params = (params || {}).$safe({
        text: 'Hello',
        fontColor: 'white',
        backgroundColor: 'hsl(200, 80%, 60%)',
        cornerRadius: 8,
        fontSize: 32,
      });

      this.bg = phina.display.RectangleShape({
        width: this.width,
        height: this.height,
        cornerRadius: params.cornerRadius,
        fill: params.backgroundColor,
        stroke: false,
      }).addChildTo(this);
      this.label = phina.display.Label({
        text: params.text,
        fill: params.fontColor,
        stroke: false,
        fontSize: params.fontSize,
      }).addChildTo(this);
    },

    _accessor: {
      text: {
        "get": function()   { return this.label.text; },
        "set": function(v)  { this.label.text = v; },
      },

      fontSize: {
        "set": function(v)  { this.label.fontSize = v; },
      },

      fontColor: {
        "set": function (v) { this.label.color = v; },
      },

      backgroundColor: {
        "set": function (v) { this.bg.color = v; },
      },
    },
  });

});


phina.namespace(function() {

  /**
   * @class phina.ui.FlatButton
   * Button
   */
  phina.define('phina.ui.FlatButton', {
    superClass: 'phina.ui.BaseButton',
    /**
     * @constructor
     */
    init: function(params) {
      this.superInit();

      params = params || {};
      params.$safe({
        width: 200,
        height: 80,
      });

      this.width = params.width;
      this.height = params.height;

      this.bg = phina.display.RectangleShape().addChildTo(this);
      this.bg.$extend({
        width: params.width,
        height: params.height,
      });
      this.label = phina.display.Label('hoge').addChildTo(this);
    },
    _accessor: {
      text: {
        "get": function()   { return this.label.text; },
        "set": function(v)  { this.label.text = v; },
      },

      fontSize: {
        "set": function(v)  { this.label.fontSize = v; },
      },

      fontColor: {
        "set": function (v) { this.label.color = v; },
      },

      backgroundColor: {
        "set": function (v) { this.bg.color = v; },
      },
    },
  });

});

phina.namespace(function() {

  /**
   * @class phina.ui.Gauge
   * 
   */
  phina.define('phina.ui.Gauge', {
    superClass: 'phina.display.Shape',

    init: function(options) {
      options = (options || {}).$safe({
        width: 256,
        height: 32,
        backgroundColor: 'transparent',
        fill: 'white',
        stroke: '#aaa',
        strokeWidth: 4,

        value: 100,
        maxValue: 100,
        gaugeColor: '#44f',
        cornerRadius: 4,
      });

      this.superInit(options);

      this._value = options.value;
      this.maxValue = options.maxValue;
      this.gaugeColor = options.gaugeColor;
      this.cornerRadius = options.cornerRadius;

      this.visualValue = options.value;
      this.animation = true;
      this.animationTime = 1*1000;
    },

    /**
     * 満タンかをチェック
     */
    isFull: function() {
      return this.value === this.maxValue;
    },

    /**
     * 空っぽかをチェック
     */
    isEmpty: function() {
      return this.value == 0;
    },

    setValue: function(value) {
      value = Math.clamp(value, 0, this._maxValue);

      // end when now value equal value of argument
      if (this.value === value) return ;

      // fire value change event
      this.flare('change');

      if (this.animation) {
        var range = Math.abs(this.visualValue-value);
        var time = (range/this.maxValue)*this.animationTime;

        this.tweener.ontween = function() {
          this._dirtyDraw = true;
        }.bind(this);
        this.tweener
          .clear()
          .to({'visualValue': value}, time)
          .call(function() {
            this.flare('changed');
            if (this.isEmpty()) {
              this.flare('empty');
            }
            else if (this.isFull()) {
              this.flare('full');
            }
          }, this);
      }
      else {
        this.visualValue = value;
        this.flare('changed');
        if (this.isEmpty()) {
          this.flare('empty');
        }
        else if (this.isFull()) {
          this.flare('full');
        }
      }

      this._value = value;
    },

    _render: function() {
      this.canvas.width = this.width + this.padding*2;
      this.canvas.height= this.height + this.padding*2;
      // 
      this.canvas.clearColor(this.backgroundColor);


      this.canvas.transformCenter();

      var rate = this.visualValue/this.maxValue;

      // draw color
      if (this.fill) {
        this.canvas.context.fillStyle = this.fill;
        this.canvas.fillRect(-this.width/2, -this.height/2, this.width, this.height);
      }
      // draw gauge
      this.canvas.context.fillStyle = this.gaugeColor;
      this.canvas.fillRect(-this.width/2, -this.height/2, this.width*rate, this.height);
      // draw stroke
      if (this.stroke) {
        this.canvas.context.lineWidth = this.strokeWidth;
        this.canvas.strokeStyle = this.stroke;
        this.canvas.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
      }
    },

    _accessor: {
      value: {
        get: function() {
          return this._value;
        },
        set: function(v) {
          this._dirtyDraw = true;
          this.setValue(v);
        },
      },
      maxValue: {
        get: function() {
          return this._maxValue;
        },
        set: function(v) {
          this._dirtyDraw = true; this._maxValue = v;
        },
      },
      gaugeColor: {
        get: function() {
          return this._gaugeColor;
        },
        set: function(v) {
          this._dirtyDraw = true; this._gaugeColor = v;
        },
      },
      cornerRadius: {
        get: function() {
          return this._cornerRadius;
        },
        set: function(v) {
          this._dirtyDraw = true; this._cornerRadius = v;
        },
      },
    }
  });

});


phina.namespace(function() {

  /**
   * @class phina.game.ManagerScene
   * 
   */
  phina.define('phina.game.ManagerScene', {
    superClass: 'phina.app.Scene',
    /**
     * @constructor
     */
    init: function(params) {
      this.superInit();

      this.setScenes(params.scenes);

      this.on("enter", function() {
        this.gotoScene(params.startLabel || 0);
      }.bind(this));

      this.on("resume", this.onnext.bind(this));

      this.commonArguments = {};
    },


    /**
     * scenes をセット
     */
    setScenes: function(scenes) {
      this.scenes = scenes;
      this.sceneIndex = 0;

      return this;
    },

    /**
     * index(or label) のシーンへ飛ぶ
     */
    gotoScene: function(index, args) {
      index = (typeof index == 'string') ? this.labelToIndex(index) : index||0;

      // イベント発火

      this.flare('prepare');

      var data = this.scenes[index];
      var klass = phina.using(data.className);
      var initArguments = data.arguments;
      var initArguments = {}.$extend(initArguments, args);
      var scene = klass.call(null, initArguments);
      if (!scene.nextLabel) {
          scene.nextLabel = data.nextLabel;
      }
      if (!scene.nextArguments) {
          scene.nextArguments = data.nextArguments;
      }
      this.app.pushScene(scene);

      this.sceneIndex = index;
      this.currentScene = scene;

      // イベント発火
      this.flare('goto', {
        scene: scene,
      });

      return this;
    },

    /**
     * 次のシーンへ飛ぶ
     */
    gotoNext: function(args) {
      var data = this.scenes[this.sceneIndex];
      var nextIndex = null;

      // 次のラベルが設定されていた場合
      if (data.nextLabel) {
          nextIndex = this.labelToIndex(data.nextLabel);
      }
      // 次のシーンに遷移
      else if (this.sceneIndex+1 < this.scenes.length) {
          nextIndex = this.sceneIndex+1;
      }

      if (nextIndex !== null) {
          this.gotoScene(nextIndex, args);
      }
      else {
          this.fire(tm.event.Event("finish"));
      }

      return this;
    },

    /**
     * シーンインデックスを取得
     */
    getCurrentIndex: function() {
      return this.sceneIndex;
    },

    /**
     * シーンラベルを取得
     */
    getCurrentLabel: function() {
      return this.scenes[this.sceneIndex].label;
    },

    /**
     * ラベルからインデックスに変換
     */
    labelToIndex: function(label) {
      var data = this.scenes.filter(function(data) {
        return data.label == label;
      })[0];

      return this.scenes.indexOf(data);
    },

    /**
     * インデックスからラベルに変換
     */
    indexToLabel: function(index) {
      return this.scenes[index].label;
    },

    onnext: function(e) {
      var nextLabel = e.prevScene.nextLabel;
      var nextArguments = e.prevScene.nextArguments;
      if (nextLabel) {
        this.gotoScene(nextLabel, nextArguments);
      }
      else {
        this.gotoNext(nextArguments);
      }
    },

  });

});

/*
 *
 */


phina.namespace(function() {

  /**
   * @class phina.game.SplashScene
   * 
   */
  phina.define('phina.game.SplashScene', {
    superClass: 'phina.display.CanvasScene',

    init: function(options) {
      this.superInit(options);

      var defaults = phina.game.SplashScene.defaults;

      var texture = phina.asset.Texture();
      texture.load(defaults.imageURL).then(function() {
        this._init();
      }.bind(this));
      this.texture = texture;
    },

    _init: function() {
      this.sprite = phina.display.Sprite(this.texture).addChildTo(this);

      this.sprite.setPosition(this.gridX.center(), this.gridY.center());
      this.sprite.alpha = 0;

      this.sprite.tweener
        .clear()
        .to({alpha:1}, 500, 'easeOutCubic')
        .wait(1000)
        .to({alpha:0}, 500, 'easeOutCubic')
        .wait(250)
        .call(function() {
          this.exit();
        }, this)
        ;
    },

    _static: {
      defaults: {
        imageURL: 'http://cdn.rawgit.com/phi-jp/phina.js/develop/logo.png',
      },
    },
  });

});

/*
 * TitleScene
 */


phina.namespace(function() {

  /**
   * @class phina.game.TitleScene
   * 
   */
  phina.define('phina.game.TitleScene', {
    superClass: 'phina.display.CanvasScene',
    /**
     * @constructor
     */
    init: function(params) {
      this.superInit(params);

      params = (params || {}).$safe(phina.game.TitleScene.defaults);

      this.backgroundColor = params.backgroundColor;

      this.fromJSON({
        children: {
          titleLabel: {
            className: 'phina.display.Label',
            arguments: {
              text: params.title,
              fill: params.fontColor,
              stroke: false,
              fontSize: 64,
            },
            x: this.gridX.center(),
            y: this.gridY.span(4),
          }
        }
      });

      if (params.exitType === 'touch') {
        this.fromJSON({
          children: {
            touchLabel: {
              className: 'phina.display.Label',
              arguments: {
                text: "TOUCH START",
                fill: params.fontColor,
                stroke: false,
                fontSize: 32,
              },
              x: this.gridX.center(),
              y: this.gridY.span(12),
            },
          },
        });

        this.on('pointstart', function() {
          this.exit();
        });
      }
    },

    _static: {
      defaults: {
        title: 'phina.js games',
        message: '',
        width: 640,
        height: 960,

        fontColor: 'white',
        backgroundColor: 'hsl(200, 80%, 64%)',
        backgroundImage: '',

        exitType: 'touch',
      },
    },

  });

});

/*
 * ResultScene
 */


phina.namespace(function() {

  /**
   * @class phina.game.ResultScene
   * 
   */
  phina.define('phina.game.ResultScene', {
    superClass: 'phina.display.CanvasScene',
    /**
     * @constructor
     */
    init: function(params) {
      this.superInit(params);

      params = (params || {}).$safe(phina.game.ResultScene.defaults);

      this.backgroundColor = params.backgroundColor;

      this.fromJSON({
        children: {
          scoreText: {
            className: 'phina.display.Label',
            arguments: {
              text: 'score',
              fill: params.fontColor,
              stroke: false,
              fontSize: 48,
            },
            x: this.gridX.span(8),
            y: this.gridY.span(4),
          },
          scoreLabel: {
            className: 'phina.display.Label',
            arguments: {
              text: params.score+'',
              fill: params.fontColor,
              stroke: false,
              fontSize: 80,
            },
            x: this.gridX.span(8),
            y: this.gridY.span(6),
          },

          messageLabel: {
            className: 'phina.display.Label',
            arguments: {
              text: params.message,
              fill: params.fontColor,
              stroke: false,
              fontSize: 32,
            },
            x: this.gridX.span(8),
            y: this.gridY.span(8),
          },

          shareButton: {
            className: 'phina.ui.Button',
            arguments: [{
              text: '★',
              width: 128,
              height: 128,
              fontSize: 50,
              cornerRadius: 64,
            }],
            x: this.gridX.span(6),
            y: this.gridY.span(11),
          },
          playButton: {
            className: 'phina.ui.Button',
            arguments: [{
              text: '▶',
              width: 128,
              height: 128,
              fontSize: 50,
              cornerRadius: 64,
            }],
            x: this.gridX.span(10),
            y: this.gridY.span(11),

            interactive: true,
            onpush: function() {
              this.exit();
            }.bind(this),
          },
        }
      });

      if (params.exitType === 'touch') {
        this.on('pointstart', function() {
          this.exit();
        });
      }

      this.shareButton.onclick = function() {
        var url = phina.social.Twitter.createURL({
          text: params.message,
          hashtags: params.hashtags,
        });
        window.open(url, 'share window', 'width=480, height=320');
      };
    },

    _static: {
      defaults: {
        score: 16,

        message: 'this is phina.js project.\n',
        hashtags: 'phina,game,javascript',
        url: phina.global.location && phina.global.location.href,

        width: 640,
        height: 960,

        fontColor: 'white',
        backgroundColor: 'hsl(200, 80%, 64%)',
        backgroundImage: '',
      },
    },

  });

});

/*
 * LoadingScene
 */


phina.namespace(function() {

  /**
   * @class phina.game.LoadingScene
   * 
   */
  phina.define('phina.game.LoadingScene', {
    superClass: 'phina.display.CanvasScene',

    /**
     * @constructor
     */
    init: function(options) {
      options = (options || {}).$safe(phina.game.LoadingScene.defaults);
      this.superInit(options);

      this.fromJSON({
        children: {
          gauge: {
            className: 'phina.ui.Gauge',
            arguments: {
              value: 0,
              width: this.width,
              height: 12,
              color: '#aaa',
              stroke: false,
              gaugeColor: 'hsla(200, 100%, 80%, 0.8)',
              padding: 0,
            },
            x: this.gridX.center(),
            y: 0,
            originY: 0,
          }
        }
      });

      var loader = phina.asset.AssetLoader();

      if (options.lie) {
        this.gauge.animationTime = 10*1000;
        this.gauge.value = 90;

        loader.onload = function() {
          this.gauge.animationTime = 1*1000;
          this.gauge.value = 100;
        }.bind(this);
      }
      else {
        loader.onprogress = function(e) {
          this.gauge.value = e.progress*100;
        }.bind(this);
      }

      this.gauge.onfull = function() {
        if (options.exitType === 'auto') {
          this.app.popScene();
        } else if (options.exitType === 'replace') {
          this.app.replaceScene(options.nextScene());
        }
      }.bind(this);

      loader.load(options.assets);
    },

    _static: {
      defaults: {
        width: 640,
        height: 960,

        exitType: 'auto',

        lie: true,
      },
    },

  });

});

/*
 * CountScene
 */


phina.namespace(function() {

  /**
   * @class phina.game.CountScene
   * 
   */
  phina.define('phina.game.CountScene', {
    superClass: 'phina.display.CanvasScene',
    /**
     * @constructor
     */
    init: function(options) {
      this.superInit(options);

      options = (options || {}).$safe(phina.game.CountScene.defaults);

      this.backgroundColor = options.backgroundColor;

      this.fromJSON({
        children: {
          label: {
            className: 'phina.display.Label',
            arguments: {
              fill: 'white',
              fontSize: options.fontSize,
              stroke: false,
            },
            x: this.gridX.center(),
            y: this.gridY.center(),
          },
        }
      });

      if (options.count instanceof Array) {
        this.countList = options.count.reverse();
      }
      else {
        this.countList = Array.range(1, options.count+1);
      }
      this.counter = this.countList.length;
      this.exitType = options.exitType;

      this._updateCount();
    },

    _updateCount: function() {
      var endFlag = this.counter <= 0;
      var index = --this.counter;

      this.label.text = this.countList[index];

      this.label.scale.set(1, 1);
      this.label.tweener
        .clear()
        .to({
          scaleX: 1,
          scaleY: 1,
          alpha: 1,
        }, 250)
        .wait(500)
        .to({
          scaleX: 1.5,
          scaleY: 1.5,
          alpha: 0.0
        }, 250)
        .call(function() {
          if (this.counter <= 0) {
            this.flare('finish');
            if (this.exitType === 'auto') {
              this.app.popScene();
            }
          }
          else {
            this._updateCount();
          }
        }, this);
    },


    _static: {
      defaults: {
        count: 3,

        width: 640,
        height: 960,

        fontColor: 'white',
        fontSize: 192,
        backgroundColor: null,

        exitType: 'auto',
      },
    },

  });

});

phina.namespace(function() {

  /**
   * @class phina.game.GameApp
   * 
   */
  phina.define('phina.game.GameApp', {
    superClass: 'phina.display.CanvasApp',

    init: function(options) {

      options = (options || {}).$safe({
        startLabel: 'title',
      });
      this.superInit(options);

      var startLabel = (options.assets) ? 'loading' : options.startLabel;

      var scene = ManagerScene({
        startLabel: startLabel,

        scenes: [
          {
            className: 'LoadingScene',
            arguments: options,
            label: 'loading',
            nextLabel: options.startLabel,
          },

          {
            className: 'SplashScene',
            arguments: options,
            label: 'splash',
            nextLabel: 'title',
          },

          {
            className: 'TitleScene',
            arguments: options,
            label: 'title',
            nextLabel: 'main',
          },
          {
            className: 'MainScene',
            arguments: options,
            label: 'main',
            nextLabel: 'result',
          },
          {
            className: 'ResultScene',
            arguments: options,
            label: 'result',
            nextLabel: 'title',
          },

          {
            className: 'PauseScene',
            arguments: options,
            label: 'pause',
          },

        ]
      });

      this.replaceScene(scene);
    },
  });

});
phina.namespace(function() {

  /**
   * @class phina.game.PieTimer
   * 
   */
  phina.define('phina.game.PieTimer', {
    superClass: 'phina.display.Shape',

    init: function(time, style) {
      style = (style || {}).$safe({
        color: '#aaa',
        radius: 64,

        stroke: true,
        strokeWidth: 4,
        strokeColor: '#aaa',

        showPercentage: false, // TODO

        backgroundColor: 'transparent',
      });

      this.superInit(style);

      this.label = phina.display.Label('hoge').addChildTo(this);

      this.time = 0;
      this.limit = time || 1000*10;

      this.starting = true;
    },

    update: function(app) {
      if (!this.starting) return ;

      this.time += app.ticker.deltaTime;
    },

    start: function() {
      this.starting = true;
    },

    stop: function() {
      this.starting = false;
    },

    _render: function() {
      var style = this.style;
      this.canvas.width = style.radius*2 + style.padding*2;
      this.canvas.height= style.radius*2 + style.padding*2;
      this.canvas.clearColor(style.backgroundColor);

      this.canvas.transformCenter();

      var rate = this.time / this.limit;
      var end = (Math.PI*2)*rate;

      if (style.stroke) {
        this.canvas.context.lineWidth = style.strokeWidth;
        this.canvas.strokeStyle = style.strokeColor;
        // this.canvas.strokePie(0, 0, style.radius, 0, end);
        this.canvas.strokeArc(0, 0, style.radius, 0-Math.PI/2, end-Math.PI/2);
      }

      this.canvas.context.fillStyle = style.color;
      this.canvas.fillPie(0, 0, style.radius, 0, end);

      if (this.label) {
        var left = Math.max(0, this.limit-this.time);
        this.label.text = Math.ceil(left/1000)+'';
      }
    },

    _accessor: {
      time: {
        get: function() {
          return this._time;
        },
        set: function(time) {
          this._time = time;
          this._render();
        },
      }
    }
  });

});


phina.namespace(function() {

  var BASE_URL = 'http://'

  /**
   * @class phina.social.Twitter
   * 
   */
  phina.define('phina.social.Twitter', {
    superClass: 'phina.display.CircleShape',
    /**
     * @constructor
     */
    init: function(params) {
      this.superInit({
        color: 'white',
        stroke: false,
      });

      var tweener = phina.accessory.Tweener().attachTo(this);
      tweener
        .to({scaleX:2, scaleY:2, alpha:0}, 500)
        .call(function() {
          this.remove();
        }, this);
    },

    _static: {
      baseURL: 'http://twitter.com/intent',
      defaults: {
        // type: 'tweet',
        text: 'Hello, world!',
        screen_name: 'phi_jp',
        hashtags: 'javascript,phina',
        // url: 'http://github.com/phi-jp/phina.js',
        url: phina.global.location && phina.global.location.href,
        via: 'phi_jp',
      },

      createURL: function(options) {
        options = (options || {}).$safe(this.defaults);

        var queries = [];
        var euc = encodeURIComponent;
        options.forIn(function(key, value) {
          var str = key + '=' + euc(value);
          queries.push(str);
        });

        var url = '{baseURL}/{type}?{query}'.format({
          baseURL: this.baseURL,
          // type: options.type,
          type: 'tweet',
          query: queries.join('&'),
        });

        return url;
      },
    }
  });

});


phina.namespace(function() {

  if (!phina.global.Box2D) {
    return ;
  }

  // http://box2dweb-doc.readthedocs.org/ja/latest/00_ready.html#id2
  phina.box2d = {
    b2: {
      Vec2          : Box2D.Common.Math.b2Vec2,
      AABB          : Box2D.Collision.b2AABB,
      BodyDef       : Box2D.Dynamics.b2BodyDef,
      Body          : Box2D.Dynamics.b2Body,
      FixtureDef    : Box2D.Dynamics.b2FixtureDef,
      Fixture       : Box2D.Dynamics.b2Fixture,
      World         : Box2D.Dynamics.b2World,
      MassData      : Box2D.Collision.Shapes.b2MassData,
      PolygonShape  : Box2D.Collision.Shapes.b2PolygonShape,
      CircleShape   : Box2D.Collision.Shapes.b2CircleShape,
      DebugDraw     : Box2D.Dynamics.b2DebugDraw,
      MouseJointDef : Box2D.Dynamics.Joints.b2MouseJointDef
    },
  };

  var b2 = phina.box2d.b2;

  /**
   * @class
   */
  phina.define('phina.box2d.Box2dLayer', {
    superClass: 'phina.display.Layer',


    init: function(params) {
      this.superInit(params);

      params = (params || {}).$safe({
        worldScale: 50, // or 50
      });

      // 重力と物理世界の設定
      var gravity = new b2.Vec2(0, 9.8);
      var world = new b2.World(gravity, true);
      
      this.world = world;
      this.world._scale = params.worldScale;

      this._setupDebugDraw();
    },

    _setupDebugDraw: function() {
      // デバッグ用スプライト
      var debugDraw = new b2.DebugDraw();
      debugDraw.SetSprite(this.canvas.context);
      debugDraw.SetDrawScale(this.world._scale);
      debugDraw.SetLineThickness(1.0);
      debugDraw.SetAlpha(1);
      debugDraw.SetFillAlpha(0.4);
      debugDraw.SetFlags(b2.DebugDraw.e_shapeBit);
      this.world.SetDebugDraw(debugDraw);
    },

    createBody: function(params) {
      params.world = this.world;
      var body = phina.box2d.Box2dBody(params);
      return body;
    },

    update: function(app) {
      // var timeStep = app.ticker.frameTime/1000;
      var timeStep = app.ticker.deltaTime/1000;
      var velocityIterations = 10;
      var positionIterations = 10;
      // 物理空間の更新
      this.world.Step(timeStep,velocityIterations,positionIterations);
    },

    draw: function(canvas) {
      // debug画面の更新
      this.world.ClearForces();
      this.world.DrawDebugData();
      var domElement = this.canvas.domElement;
      canvas.context.drawImage(domElement, 0, 0, domElement.width, domElement.height);
    },
  });
});




phina.namespace(function() {
  
  if (!phina.global.Box2D) {
    return ;
  }

  var b2 = phina.box2d.b2;

  /**
   * @class
   */
  phina.define('phina.box2d.Box2dBody', {
    superClass: 'phina.accessory.Accessory',


    init: function(params) {
      this.superInit();

      this.world = params.world;
      this.type = params.type;
      this.shape = params.shape;

      this._init();

      this.on('attached', function() {
        var target = this.target;

        var p = new b2.Vec2(target.x/this.world._scale, target.y/this.world._scale);
        this.body.SetPosition(p);
        this.body.SetAngle(target.rotation * Math.PI/180);

        this._bindFixture(this.target);
      });
    },

    update: function(app) {
      var target = this.target;

      target.x = this.body.GetPosition().x * this.world._scale;
      target.y = this.body.GetPosition().y * this.world._scale;
      target.rotation = this.body.GetAngle() * 180/Math.PI;
    },

    _init: function() {
      this._setupBody();
      return this;
    },

    _setupBody: function() {
      var self = this;
      var world = this.world;
      var scale = world._scale;
      var bodyDef = new b2.BodyDef();
      bodyDef.type = (function() {
        return {
          'dynamic': b2.Body.b2_dynamicBody, 
          'kinematic': b2.Body.b2_kinematicBody, 
          'static': b2.Body.b2_staticBody, 
        }[self.type || 'dynamic'];
      })();
      bodyDef.position.Set(0, 0);
      var body = world.CreateBody(bodyDef);
      this.body = body;

      return this;
    },

    _bindFixture: function() {
      var self = this;
      var target = this.target;
      var fixture = this.body.GetFixtureList();
      if (fixture) {
        this.body.DestroyFixture(fixture);
      }

      // 
      var world = this.world;
      var scale = world._scale;
      // shape を取得
      var shape = (function() {
        var shape = null;
        if (self.shape === 'circle') {
          shape = new b2.CircleShape(target.radius / scale);
        }
        else if (self.shape === 'box'){
          shape = new b2.PolygonShape();
          shape.SetAsBox(target.width / scale / 2, target.height / scale / 2 );
        }
        else {
          shape = new b2.CircleShape(32 / scale);
        }
        return shape;
      })();

      var fixture = new b2.FixtureDef();
      fixture.shape = shape;
      // TODO: このへんは引数で指定できるようにする
      fixture.density = 1;
      fixture.friction = 0.3;
      fixture.restitution = 0.5;
      this.body.CreateFixture(fixture);
    },
  });
});

