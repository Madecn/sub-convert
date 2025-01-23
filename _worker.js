var er = Object.defineProperty;
var tt = (e) => {
  throw TypeError(e);
};
var tr = (e, t, r) => t in e ? er(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var A = (e, t, r) => tr(e, typeof t != "symbol" ? t + "" : t, r), Be = (e, t, r) => t.has(e) || tt("Cannot " + r);
var u = (e, t, r) => (Be(e, t, "read from private field"), r ? r.call(e) : t.get(e)), x = (e, t, r) => t.has(e) ? tt("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), b = (e, t, r, n) => (Be(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r), rt = (e, t, r) => (Be(e, t, "access private method"), r);
function yt() {
  return [
    { label: "Clash", value: "clash" },
    { label: "ClashR", value: "clashr" },
    { label: "Sing-box", value: "singbox" }
  ];
}
class C {
  static json(t, r = 200) {
    return new Response(JSON.stringify(t), {
      status: r,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }
  static error(t, r = 400) {
    return this.json({ error: t }, r);
  }
  static success(t) {
    return this.json({ data: t });
  }
  static cors(t) {
    const r = new Headers(t.headers);
    return r.set("Access-Control-Allow-Origin", "*"), r.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"), r.set("Access-Control-Allow-Headers", "Content-Type"), new Response(t.body, {
      status: t.status,
      statusText: t.statusText,
      headers: r
    });
  }
}
class rr {
  constructor(t) {
    this.service = t;
  }
  async toSub(t, r) {
    try {
      const n = new URL(t.url).searchParams.get("target");
      if (!n)
        return C.error("Unsupported client type");
      const o = yt().map((a) => a.value);
      if (!o.includes(n))
        return C.error(`Unsupported client type, support list: ${o.join(", ")}`);
      const s = await this.service.toSub(t, r, n);
      return C.cors(s);
    } catch (n) {
      return C.error(n.message || "Invalid request");
    }
  }
  async add(t) {
    try {
      const { long_url: r, serve: n } = await t.json();
      if (!r)
        return C.error("Missing long_url");
      const i = new URL(t.url), o = n || `${i.protocol}//${i.host}`, s = await this.service.add(r, o);
      return C.success(s);
    } catch (r) {
      return C.error(r.message || "Invalid request");
    }
  }
  async delete(t) {
    try {
      const n = new URL(t.url).searchParams.get("code");
      return n ? (await this.service.deleteByCode(n), C.success({ deleted: !0 })) : C.error("Missing code");
    } catch (r) {
      return C.error(r.message || "Invalid request");
    }
  }
  async queryByCode(t) {
    try {
      const n = new URL(t.url).searchParams.get("code");
      if (!n)
        return C.error("Missing code");
      const i = await this.service.getByCode(n);
      return i ? C.success(i) : C.error("Not found", 404);
    } catch (r) {
      return C.error(r.message || "Invalid request");
    }
  }
  async queryList(t) {
    try {
      const r = new URL(t.url), n = Number.parseInt(r.searchParams.get("page") || "1"), i = Number.parseInt(r.searchParams.get("pageSize") || "10"), o = await this.service.getList(n, i);
      return C.success(o);
    } catch (r) {
      return C.error(r.message || "Invalid request");
    }
  }
  async redirect(t) {
    var r;
    try {
      const n = (r = t.params) == null ? void 0 : r.code;
      if (!n)
        return C.error("Invalid short URL");
      const i = await this.service.getByCode(n);
      return i ? Response.redirect(i.long_url, 302) : C.error("Not found", 404);
    } catch (n) {
      return C.error(n.message || "Invalid request");
    }
  }
}
class ir {
  constructor() {
    A(this, "routes", []);
  }
  get(t, r) {
    return this.add("GET", t, r), this;
  }
  post(t, r) {
    return this.add("POST", t, r), this;
  }
  put(t, r) {
    return this.add("PUT", t, r), this;
  }
  delete(t, r) {
    return this.add("DELETE", t, r), this;
  }
  add(t, r, n) {
    const i = r.startsWith("/") ? r : `/${r}`;
    this.routes.push({
      pattern: new URLPattern({ pathname: i }),
      handler: async (o, s) => o.method !== t ? new Response("Method Not Allowed", { status: 405 }) : n(o, s)
    });
  }
  async handle(t, r) {
    const n = new URL(t.url);
    for (const i of this.routes) {
      const o = i.pattern.exec(n);
      if (o) {
        const s = o.pathname.groups;
        return Object.defineProperty(t, "params", {
          value: s,
          writable: !1
        }), i.handler(t, r);
      }
    }
    return new Response("Not Found", { status: 404 });
  }
}
function nr() {
  return `
        <script>
            class SubButton extends HTMLElement {
                static get observedAttributes() {
                    return ['disabled', 'readonly', 'type'];
                }

                constructor() {
                    super();
                    this.attachShadow({ mode: 'open' });
                    this.#render();
                }

                #injectStyle() {
                    const style = document.createElement('style');
                    style.textContent = \`
                        :host {
                            display: inline-block;
                        }

                        .sub-button {
                            position: relative;
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            padding: 4px 15px;
                            font-size: 14px;
                            border-radius: var(--radius);
                            border: 1px solid var(--border-color);
                            background: var(--background);
                            color: var(--text-primary);
                            cursor: pointer;
                            transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
                            user-select: none;
                            height: 32px;
                            min-width: 88px;
                            white-space: nowrap;
                            gap: 6px;
                        }

                        .sub-button:not(:disabled):not([readonly]):hover {
                            color: var(--primary-color);
                            border-color: var(--primary-color);
                        }

                        .sub-button:not(:disabled):not([readonly]):active {
                            opacity: 0.8;
                        }

                        .sub-button[type="primary"] {
                            background: var(--primary-color);
                            border-color: var(--primary-color);
                            color: #fff;
                        }

                        .sub-button[type="primary"]:not(:disabled):not([readonly]):hover {
                            background: var(--primary-hover);
                            border-color: var(--primary-hover);
                            color: #fff;
                        }

                        .sub-button:disabled,
                        .sub-button[readonly] {
                            cursor: not-allowed;
                            background-color: var(--background-disabled);
                            border-color: var(--border-color);
                            color: var(--text-disabled);
                        }

                        /* 波纹效果 */
                        .sub-button::after {
                            content: '';
                            position: absolute;
                            inset: -1px;
                            border-radius: inherit;
                            opacity: 0;
                            transition: all 0.2s;
                            background-color: var(--primary-color);
                        }

                        .sub-button:not(:disabled):not([readonly]):active::after {
                            opacity: 0.1;
                            transition: 0s;
                        }

                        /* 图标样式 */
                        ::slotted(svg) {
                            width: 16px;
                            height: 16px;
                            fill: currentColor;
                        }
                    \`;
                    this.shadowRoot.appendChild(style);
                }

                #injectElement() {
                    const button = document.createElement('button');
                    button.className = 'sub-button';

                    // 添加插槽
                    const slot = document.createElement('slot');
                    button.appendChild(slot);

                    this.shadowRoot.appendChild(button);
                }

                #render() {
                    this.#injectStyle();
                    this.#injectElement();
                }

                attributeChangedCallback(name, oldValue, newValue) {
                    if (oldValue === newValue) return;

                    const button = this.shadowRoot.querySelector('.sub-button');
                    if (!button) return;

                    switch (name) {
                        case 'disabled':
                            button.disabled = this.hasAttribute('disabled');
                            break;
                        case 'readonly':
                            button.setAttribute('readonly', '');
                            break;
                        case 'type':
                            button.setAttribute('type', newValue);
                            break;
                    }
                }
            }

            customElements.define('sub-button', SubButton);
        <\/script>
    `;
}
function or() {
  return `
    <script>
        class SubCheckbox extends HTMLElement {
            static get observedAttributes() {
                return ['value', 'options', 'disabled', 'key', 'span'];
            }

            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.state = {
                    value: [],
                    options: []
                };
                this.#render();
            }

            #initValue() {
                const selectedValues = this.getAttribute('value') || [];

                if (selectedValues.length > 0) {
                    this.state.value = selectedValues;
                    this.#renderOptions();
                }
            }

            #injectStyle() {
                const style = document.createElement('style');
                const span = this.getAttribute('span') || 4;
                style.textContent = \`
                    :host {
                        display: block;
                        width: 100%;
                    }
                    .sub-checkbox-container {
                        background-color: var(--background);
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius);
                        transition: var(--transition);
                    }
                    .sub-checkbox-container:hover {
                        border-color: var(--border-hover);
                    }
                    .sub-checkbox-group {
                        display: grid;
                        grid-template-columns: repeat(\${span}, 1fr);
                        gap: 16px;
                        width: 100%;
                        height: 32px;
                    }
                    .sub-checkbox {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        user-select: none;
                        color: var(--text-primary);
                    }
                    .sub-checkbox__input {
                        position: relative;
                        width: 10px;
                        height: 10px;
                        border: 2px solid var(--border-color);
                        border-radius: 4px;
                        background-color: var(--background);
                        margin-right: 8px;
                        transition: all .3s;
                    }
                    .sub-checkbox__input::after {
                        content: '';
                        position: absolute;
                        top: 0px;
                        left: 3px;
                        width: 3px;
                        height: 6px;
                        border: 2px solid #fff;
                        border-left: 0;
                        border-top: 0;
                        transform: rotate(45deg) scaleY(0);
                        transition: transform .15s ease-in .05s;
                        transform-origin: center;
                    }
                    .sub-checkbox__input_checked {
                        background-color: var(--primary-color);
                        border-color: var(--primary-color);
                    }
                    .sub-checkbox__input_checked::after {
                        transform: rotate(45deg) scaleY(1);
                    }

                    .sub-checkbox__label {
                        font-size: 14px;
                        line-height: 14px;
                    }

                    .sub-checkbox:hover .sub-checkbox__input:not(.sub-checkbox__input_disabled) {
                        border-color: var(--primary-color);
                    }
                    .sub-checkbox__input_disabled {
                        background-color: var(--background-disabled);
                        border-color: var(--border-color);
                    }
                    .sub-checkbox__label_disabled {
                        color: var(--text-disabled);
                    }
                \`;
                this.shadowRoot.appendChild(style);
            }

            #injectElement() {
                const container = document.createElement('div');
                container.className = 'sub-checkbox-container';

                const wrapper = document.createElement('div');
                wrapper.className = 'sub-checkbox-group';

                container.appendChild(wrapper);
                this.shadowRoot.appendChild(container);

                this.#renderOptions();
            }

            #renderOptions() {
                const wrapper = this.shadowRoot.querySelector('.sub-checkbox-group');
                wrapper.innerHTML = '';

                this.state.options.forEach(option => {
                    const checkbox = document.createElement('label');
                    checkbox.className = 'sub-checkbox';

                    const input = document.createElement('span');
                    input.className = 'sub-checkbox__input';
                    if (this.state.value.includes(option.value)) {
                        input.classList.add('sub-checkbox__input_checked');
                    }
                    if (this.hasAttribute('disabled')) {
                        input.classList.add('sub-checkbox__input_disabled');
                    }

                    const label = document.createElement('span');
                    label.className = 'sub-checkbox__label';
                    if (this.hasAttribute('disabled')) {
                        label.classList.add('sub-checkbox__label_disabled');
                    }
                    label.textContent = option.label;

                    checkbox.appendChild(input);
                    checkbox.appendChild(label);

                    if (!this.hasAttribute('disabled')) {
                        checkbox.addEventListener('click', () => this.#handleClick(option.value));
                    }

                    wrapper.appendChild(checkbox);
                });
            }

            #handleClick(value) {
                const index = this.state.value.indexOf(value);
                if (index === -1) {
                    this.state.value.push(value);
                } else {
                    this.state.value.splice(index, 1);
                }

                this.#renderOptions();

                // 触发事件
                this.dispatchEvent(new Event('change', { bubbles: true }));
                this.dispatchEvent(new Event('input', { bubbles: true }));
                this.dispatchEvent(
                    new CustomEvent('update:value', {
                        detail: {
                            value: [...this.state.value]
                        },
                        bubbles: true
                    })
                );
            }

            #render() {
                this.#injectStyle();
                this.#injectElement();
            }

            get value() {
                return [...this.state.value];
            }

            set value(val) {
                if (Array.isArray(val)) {
                    this.state.value = [...val];
                    this.#renderOptions();
                }
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (oldValue === newValue) return;

                switch (name) {
                    case 'value':
                        try {
                            this.value = JSON.parse(newValue);
                        } catch (e) {
                            console.error('Invalid value format:', e);
                        }
                        break;
                    case 'options':
                        try {
                            this.state.options = JSON.parse(newValue);
                            this.#initValue(); // 设置选项后初始化选中状态
                            this.#renderOptions();
                        } catch (e) {
                            console.error('Invalid options format:', e);
                        }
                        break;
                    case 'disabled':
                        this.#renderOptions();
                        break;
                }
            }
        }
        customElements.define('sub-checkbox', SubCheckbox);
    <\/script>
    `;
}
function sr() {
  return `
    <script>
        class SubForm extends HTMLElement {
            static get observedAttributes() {
                return ['model', 'label-width'];
            }

            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.model = {};
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (name === 'model' && oldValue !== newValue) {
                    try {
                        this.model = JSON.parse(newValue);
                        // 更新所有子组件的值
                        this.#updateChildrenValues();
                    } catch (e) {
                        console.error('Invalid model:', e);
                    }
                }
            }

            #updateChildrenValues() {
                // 找到所有带有 key 属性的子组件
                this.querySelectorAll('[key]').forEach(child => {
                    const key = child.getAttribute('key');
                    if (key && this.model[key] !== undefined) {
                        // 根据值的类型设置不同的格式
                        if (Array.isArray(this.model[key])) {
                            child.setAttribute('value', JSON.stringify(this.model[key]));
                        } else {
                            child.setAttribute('value', this.model[key]);
                        }
                    }
                });
            }

            connectedCallback() {
                const modelStr = this.getAttribute('model');
                if (modelStr) {
                    this.model = JSON.parse(modelStr);
                }

                this.addEventListener('update:value', e => {
                    const key = e.target.getAttribute('key');
                    if (key && this.model) {
                        this.model[key] = e.detail.value;
                        this.dispatchEvent(
                            new CustomEvent('form:change', {
                                detail: {
                                    key,
                                    value: e.detail.value,
                                    formData: this.model
                                },
                                bubbles: true
                            })
                        );
                    }
                });

                this.#render();
            }

            #injectStyle() {
                const style = document.createElement('style');
                const labelWidth = this.getAttribute('label-width') || '80px';
                style.textContent = \`
                    :host {
                        display: block;
                    }
                    form {
                        margin: 0;
                        padding: 0;
                    }
                    ::slotted(sub-form-item) {
                        --label-width: \${labelWidth};
                    }
                \`;
                this.shadowRoot.appendChild(style);
            }

            #injectElement() {
                const form = document.createElement('form');
                const slot = document.createElement('slot');
                form.appendChild(slot);
                this.shadowRoot.appendChild(form);

                this.#bindEvents(form);
            }

            #bindEvents(form) {
                form.addEventListener('submit', e => {
                    e.preventDefault();
                    if (this.validate()) {
                        this.dispatchEvent(
                            new CustomEvent('submit', {
                                detail: this.getFormData(),
                                bubbles: true
                            })
                        );
                    }
                });
            }

            #render() {
                this.#injectStyle();
                this.#injectElement();
                this.#bindEvents(this.shadowRoot.querySelector('form'));
            }
        }
        customElements.define('sub-form', SubForm);
    <\/script>
    `;
}
function ar() {
  return `
    <script>
        class SubFormItem extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
            }

            connectedCallback() {
                this.#render();
            }

            #render() {
                const style = document.createElement('style');
                style.textContent = \`
                    :host {
                        display: block;
                        margin-bottom: 24px;
                    }
                    .sub-form-item {
                        display: flex;
                        align-items: flex-start;
                        position: relative;
                    }
                    .sub-form-item__label {
                        flex: 0 0 auto;
                        width: var(--label-width, 80px);
                        text-align: right;
                        padding: 6px 12px 0 0;
                        color: var(--text-secondary);
                        font-size: 14px;
                        line-height: 20px;
                        font-weight: 500;
                        transition: var(--transition);
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .sub-form-item__content {
                        flex: 1;
                        min-width: 0;
                        position: relative;
                        transition: var(--transition);
                    }
                    .sub-form-item__label.required::before {
                        content: '*';
                        color: #ff4d4f;
                        margin-right: 4px;
                    }
                    :host([disabled]) .sub-form-item__label {
                        color: var(--text-disabled);
                    }
                    :host([error]) .sub-form-item__label {
                        color: #ff4d4f;
                    }
                \`;

                const template = document.createElement('div');
                template.className = 'sub-form-item';

                const label = document.createElement('label');
                label.className = 'sub-form-item__label';
                label.textContent = this.getAttribute('label') || '';

                const content = document.createElement('div');
                content.className = 'sub-form-item__content';
                content.appendChild(document.createElement('slot'));

                template.appendChild(label);
                template.appendChild(content);

                this.shadowRoot.appendChild(style);
                this.shadowRoot.appendChild(template);
            }
        }
        customElements.define('sub-form-item', SubFormItem);
    <\/script>
    `;
}
function lr() {
  return `
    <script>
        class SubInput extends HTMLElement {
            static get observedAttributes() {
                return ['value', 'placeholder', 'disabled', 'key'];
            }

            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.state = {
                    value: this.getAttribute('value') || ''
                };
                this.#render();
            }

            #injectStyle() {
                const style = document.createElement('style');
                style.textContent = \`
                    :host {
                        display: inline-block;
                        width: 100%;
                        vertical-align: bottom;
                        font-size: 14px;
                    }
                    .sub-input {
                        position: relative;
                        font-size: 14px;
                        display: inline-flex;
                        width: 100%;
                        line-height: 32px;
                    }
                    .sub-input__wrapper {
                        display: flex;
                        flex: 1;
                        align-items: center;
                        background-color: var(--background);
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius);
                        transition: var(--transition);
                        overflow: hidden;
                    }
                    .sub-input__wrapper:hover {
                        border-color: var(--border-hover);
                    }
                    .sub-input__wrapper:focus-within {
                        border-color: var(--primary-color);
                        box-shadow: 0 0 0 2px var(--shadow);
                    }
                    .sub-input__inner {
                        flex: 1;
                        padding: 0 15px;
                        background: none;
                        border: none;
                        outline: none;
                        color: var(--text-primary);
                        font-size: inherit;
                        height: 100%;
                    }
                    .sub-input__inner::placeholder {
                        color: var(--text-secondary);
                    }
                    .sub-input__inner:disabled {
                        background-color: var(--background-disabled);
                        color: var(--text-disabled);
                    }
                    .sub-input__append {
                        background-color: var(--background-secondary);
                        border-color: var(--border-color);
                    }
                    ::slotted(button) {
                        margin: 0;
                        height: 100%;
                        width: 100%;
                        background-color: var(--primary-color);
                        color: var(--background);
                        border: 1px solid var(--primary-color);
                        padding: 0 20px;
                        border-radius: 0 var(--radius) var(--radius) 0;
                        cursor: pointer;
                        font-size: 14px;
                        line-height: 32px;
                        white-space: nowrap;
                        transition: var(--transition);
                        position: relative;
                        outline: none;
                    }
                    ::slotted(button:hover) {
                        background-color: var(--primary-hover);
                        border-color: var(--primary-hover);
                    }
                    ::slotted(button:active) {
                        background-color: var(--primary-active);
                        border-color: var(--primary-active);
                    }
                    .sub-input__prepend,
                    .sub-input__append {
                        display: flex;
                        align-items: center;
                        background-color: var(--background-secondary);
                        color: var(--text-secondary);
                        white-space: nowrap;
                        padding: 0 15px;
                        border: 1px solid var(--border-color);
                        transition: var(--transition);
                    }
                    .sub-input__prepend {
                        border-right: 0;
                        border-radius: var(--radius) 0 0 var(--radius);
                    }
                    .sub-input__append {
                        padding: 0;
                        border-left: 0;
                        border-radius: 0 var(--radius) var(--radius) 0;
                    }
                    .sub-input__prepend ::slotted(*) {
                        color: var(--text-secondary);
                    }
                \`;
                this.shadowRoot.appendChild(style);
            }

            #injectElement() {
                const wrapper = document.createElement('div');
                wrapper.className = 'sub-input';

                // prepend slot
                const prepend = document.createElement('div');
                prepend.className = 'sub-input__prepend';
                prepend.style.display = 'none'; // 默认隐藏
                const prependSlot = document.createElement('slot');
                prependSlot.name = 'prepend';
                prepend.appendChild(prependSlot);

                // input wrapper
                const inputWrapper = document.createElement('div');
                inputWrapper.className = 'sub-input__wrapper';

                // input
                const input = document.createElement('input');
                input.className = 'sub-input__inner';
                input.value = this.state.value;
                input.placeholder = this.getAttribute('placeholder') || '';
                input.disabled = this.hasAttribute('disabled');
                inputWrapper.appendChild(input);

                // append slot
                const append = document.createElement('div');
                append.className = 'sub-input__append';
                append.style.display = 'none'; // 默认隐藏
                const appendSlot = document.createElement('slot');
                appendSlot.name = 'append';
                append.appendChild(appendSlot);

                wrapper.appendChild(prepend);
                wrapper.appendChild(inputWrapper);
                wrapper.appendChild(append);
                this.shadowRoot.appendChild(wrapper);

                // 监听插槽内容变化
                prependSlot.addEventListener('slotchange', e => {
                    const nodes = prependSlot.assignedNodes();
                    prepend.style.display = nodes.length ? 'flex' : 'none';
                    if (nodes.length) {
                        inputWrapper.style.borderTopLeftRadius = '0';
                        inputWrapper.style.borderBottomLeftRadius = '0';
                    } else {
                        inputWrapper.style.borderTopLeftRadius = '4px';
                        inputWrapper.style.borderBottomLeftRadius = '4px';
                    }
                });

                appendSlot.addEventListener('slotchange', e => {
                    const nodes = appendSlot.assignedNodes();
                    append.style.display = nodes.length ? 'flex' : 'none';
                    if (nodes.length) {
                        inputWrapper.style.borderTopRightRadius = '0';
                        inputWrapper.style.borderBottomRightRadius = '0';
                    } else {
                        inputWrapper.style.borderTopRightRadius = '4px';
                        inputWrapper.style.borderBottomRightRadius = '4px';
                    }
                });

                this.#bindEvents(input);
            }

            #bindEvents(input) {
                input.addEventListener('input', e => {
                    this.state.value = e.target.value;
                    this.dispatchEvent(new Event('input', { bubbles: true }));
                    this.dispatchEvent(new Event('change', { bubbles: true }));
                    this.dispatchEvent(
                        new CustomEvent('update:value', {
                            detail: {
                                value: e.target.value
                            },
                            bubbles: true
                        })
                    );
                });
            }

            #render() {
                this.#injectStyle();
                this.#injectElement();
            }

            get value() {
                return this.state.value;
            }

            set value(val) {
                if (val !== this.state.value) {
                    this.state.value = val;
                    const input = this.shadowRoot.querySelector('input');
                    if (input) {
                        input.value = val;
                    }
                }
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (oldValue === newValue) return;

                const input = this.shadowRoot.querySelector('input');
                if (!input) return;

                switch (name) {
                    case 'value':
                        this.value = newValue;
                        break;
                    case 'placeholder':
                        input.placeholder = newValue;
                        break;
                    case 'disabled':
                        input.disabled = this.hasAttribute('disabled');
                        break;
                }
            }
        }
        customElements.define('sub-input', SubInput);
    <\/script>
    `;
}
function cr() {
  return `
        <style>
            /* 添加通知组件样式 */
            .notification-container {
                position: fixed;
                top: 8px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                align-items: center;
                pointer-events: none;
            }

            .notification {
                padding: 9px 12px;
                margin-bottom: 8px;
                border-radius: 4px;
                background: var(--background);
                box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
                display: inline-flex;
                align-items: center;
                gap: 8px;
                pointer-events: auto;
                animation: messageMove 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
            }

            .notification-icon {
                font-size: 16px;
                line-height: 1;
            }

            .notification.success .notification-icon {
                color: #52c41a;
            }

            .notification.error .notification-icon {
                color: #ff4d4f;
            }

            .notification.info .notification-icon {
                color: var(--primary-color);
            }

            .notification-content {
                color: var(--text-primary);
                font-size: 14px;
                line-height: 1.5;
            }

            @keyframes messageMove {
                0% {
                    padding: 6px 12px;
                    opacity: 0;
                    transform: translateY(-100%);
                }
                100% {
                    padding: 9px 12px;
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        </style>


        <script>
            class SubNotification {
                static instance = null;

                constructor() {
                    if (SubNotification.instance) {
                        return SubNotification.instance;
                    }
                    this.init();
                    SubNotification.instance = this;
                }

                init() {
                    const container = document.createElement('div');
                    container.className = 'notification-container';
                    document.body.appendChild(container);
                    this.container = container;
                }

                show(message, type = 'info', duration = 3000) {
                    const notification = document.createElement('div');
                    notification.className = \`notification \${type}\`;

                    // 添加图标
                    const icon = document.createElement('span');
                    icon.className = 'notification-icon';
                    icon.innerHTML = this.#getIconByType(type);

                    const content = document.createElement('span');
                    content.className = 'notification-content';
                    content.textContent = message;

                    notification.appendChild(icon);
                    notification.appendChild(content);
                    this.container.appendChild(notification);

                    const close = () => {
                        notification.style.opacity = '0';
                        notification.style.transform = 'translateY(-100%)';
                        notification.style.transition = 'all .3s cubic-bezier(.645,.045,.355,1)';
                        setTimeout(() => {
                            this.container.removeChild(notification);
                        }, 300);
                    };

                    if (duration > 0) {
                        setTimeout(close, duration);
                    }
                }

                static success(message, duration = 3000) {
                    if (!this.instance) {
                        new SubNotification();
                    }
                    this.instance.show(message, 'success', duration);
                }

                static error(message, duration = 3000) {
                    if (!this.instance) {
                        new SubNotification();
                    }
                    this.instance.show(message, 'error', duration);
                }

                static info(message, duration = 3000) {
                    if (!this.instance) {
                        new SubNotification();
                    }
                    this.instance.show(message, 'info', duration);
                }

                #getIconByType(type) {
                    const icons = {
                        success: \`<svg viewBox="64 64 896 896" width="1em" height="1em">
                            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z" fill="currentColor"/>
                        </svg>\`,
                        error: \`<svg viewBox="64 64 896 896" width="1em" height="1em">
                            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z" fill="currentColor"/>
                        </svg>\`,
                        info: \`<svg viewBox="64 64 896 896" width="1em" height="1em">
                            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 010-96 48.01 48.01 0 010 96z" fill="currentColor"/>
                        </svg>\`
                    };
                    return icons[type] || icons.info;
                }
            }

            // 添加到全局
            window.notification = SubNotification;
        <\/script>
    
    
    `;
}
function Ct() {
  return {
    arrow: `<svg viewBox="0 0 1024 1024" width="12" height="12">
                    <path d="M831.872 340.864L512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.6 30.592 30.592 0 0 0-42.752-.064z" fill="currentColor"></path>
                </svg>`,
    empty: `<svg viewBox="0 0 1024 1024" width="64" height="64">
                    <path d="M855.6 427.2H168.4c-12.8 0-24 10.4-24 23.2v374.4c0 12.8 11.2 23.2 24 23.2h687.2c12.8 0 24-10.4 24-23.2V450.4c0-12.8-11.2-23.2-24-23.2z" fill="#e6f0fc"></path>
                    <path d="M296 428.8h-128v372.8h128V428.8z m32 0v372.8h496V428.8H328z" fill="#ffffff"></path>
                    <path d="M440 176h144v76.8H440z" fill="#e6f0fc"></path>
                    <path d="M855.6 400H168.4c-12.8 0-24 10.4-24 23.2v374.4c0 12.8 11.2 23.2 24 23.2h687.2c12.8 0 24-10.4 24-23.2V423.2c0-12.8-11.2-23.2-24-23.2z m-687.2 27.2h687.2v374.4H168.4V427.2z" fill="#4c98f7"></path>
                </svg>`
  };
}
const ur = Ct();
function pr() {
  return `
    <script>
        class SubMultiSelect extends HTMLElement {
            static get observedAttributes() {
                return ['value', 'options', 'disabled'];
            }

            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.state = {
                    value: [],
                    options: [],
                    isOpen: false
                };
                this.#render();
            }

            #injectStyle() {
                const style = document.createElement('style');
                style.textContent = \`
                    :host {
                        display: inline-block;
                        width: 100%;
                        font-size: 14px;
                    }

                    .sub-multi-select {
                        position: relative;
                        display: inline-block;
                        width: 100%;
                    }

                    .sub-multi-select__wrapper {
                        position: relative;
                        min-height: 32px;
                        padding: 0px 30px 0px 12px;
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius);
                        background-color: var(--background);
                        cursor: pointer;
                        transition: var(--transition);
                        display: flex;
                        flex-wrap: wrap;
                        gap: 4px;
                        align-items: center;
                    }

                    .sub-multi-select__wrapper:hover {
                        border-color: var(--border-hover);
                    }

                    .sub-multi-select__wrapper_active {
                        border-color: var(--primary-color);
                        box-shadow: 0 0 0 2px var(--shadow);
                    }

                    .sub-multi-select__wrapper_disabled {
                        cursor: not-allowed;
                        background-color: var(--background-disabled);
                    }

                    .sub-multi-select__placeholder {
                        color: var(--text-secondary);
                    }

                    .sub-multi-select__tag {
                        display: inline-flex;
                        align-items: center;
                        padding: 0 8px;
                        height: 22px;
                        line-height: 22px;
                        background-color: var(--background-secondary);
                        border-radius: var(--radius);
                        color: var(--text-primary);
                        gap: 2px;
                    }

                    .sub-multi-select__tag-close {
                        cursor: pointer;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        transition: var(--transition);
                    }

                    .sub-multi-select__tag-close:hover {
                        background-color: rgba(0, 0, 0, 0.1);
                    }

                    .sub-multi-select__arrow {
                        position: absolute;
                        right: 8px;
                        top: 50%;
                        transform: translateY(-50%);
                        color: #c0c4cc;
                        transition: transform .3s;
                    }

                    .sub-multi-select__arrow_active {
                        transform: translateY(-50%) rotate(180deg);
                    }

                    .sub-multi-select__dropdown {
                        position: absolute;
                        top: calc(100% + 8px);
                        left: 0;
                        width: 100%;
                        max-height: 274px;
                        padding: 6px 0;
                        background: var(--background);
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius);
                        box-shadow: 0 4px 12px var(--shadow);
                        box-sizing: border-box;
                        margin: 0;
                        opacity: 0;
                        transform: scaleY(0);
                        transform-origin: center top;
                        transition: .3s cubic-bezier(.645,.045,.355,1);
                        z-index: 1000;
                        overflow-y: auto;
                    }

                    .sub-multi-select__dropdown_visible {
                        opacity: 1;
                        transform: scaleY(1);
                    }

                    .sub-multi-select__option {
                        position: relative;
                        padding: 0 32px 0 12px;
                        height: 28px;
                        line-height: 28px;
                        color: var(--text-primary);
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }

                    .sub-multi-select__option:hover {
                        background-color: var(--background-secondary);
                    }

                    .sub-multi-select__option_selected {
                        color: var(--primary-color);
                    }

                    .sub-multi-select__checkbox {
                        width: 12px;
                        height: 12px;
                        border: 1px solid var(--border-color);
                        border-radius: 4px;
                        position: relative;
                        transition: var(--transition);
                    }

                    .sub-multi-select__checkbox::after {
                        content: '';
                        position: absolute;
                        top: 1px;
                        left: 4px;
                        width: 3px;
                        height: 7px;
                        border: 2px solid #fff;
                        border-left: 0;
                        border-top: 0;
                        transform: rotate(45deg) scale(0);
                        transition: transform .15s ease-in .05s;
                        transform-origin: center;
                    }

                    .sub-multi-select__checkbox_checked {
                        background-color: var(--primary-color);
                        border-color: var(--primary-color);
                    }

                    .sub-multi-select__checkbox_checked::after {
                        transform: rotate(45deg) scale(1);
                    }

                    .sub-multi-select__empty {
                        padding: 32px 0;
                        text-align: center;
                        color: #909399;
                    }
                \`;
                this.shadowRoot.appendChild(style);
            }

            #injectElement() {
                const template = document.createElement('div');
                template.className = 'sub-multi-select';

                // 创建选择框主体
                const wrapper = document.createElement('div');
                wrapper.className = 'sub-multi-select__wrapper';
                if (this.hasAttribute('disabled')) {
                    wrapper.classList.add('sub-multi-select__wrapper_disabled');
                }

                // 创建箭头图标
                const arrow = document.createElement('span');
                arrow.className = 'sub-multi-select__arrow';
                arrow.innerHTML = \`${ur.arrow}\`;

                // 创建下拉框
                const dropdown = document.createElement('div');
                dropdown.className = 'sub-multi-select__dropdown';

                wrapper.appendChild(arrow);
                template.appendChild(wrapper);
                template.appendChild(dropdown);

                this.shadowRoot.appendChild(template);

                this.#bindEvents(wrapper, arrow, dropdown);
                this.#renderTags(wrapper);
            }

            #renderTags(wrapper) {
                // 清空现有内容，保留箭头
                const arrow = wrapper.querySelector('.sub-multi-select__arrow');
                wrapper.innerHTML = '';

                if (this.state.value.length === 0) {
                    const placeholder = document.createElement('span');
                    placeholder.className = 'sub-multi-select__placeholder';
                    placeholder.textContent = this.getAttribute('placeholder') || '请选择';
                    wrapper.appendChild(placeholder);
                } else {
                    this.state.value.forEach(value => {
                        const option = this.state.options.find(opt => opt.value === value);
                        if (option) {
                            const tag = document.createElement('span');
                            tag.className = 'sub-multi-select__tag';
                            tag.innerHTML = \`
                                \${option.label}
                                <span class="sub-multi-select__tag-close">
                                    <svg viewBox="0 0 1024 1024" width="12" height="12">
                                        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z" fill="currentColor"/>
                                    </svg>
                                </span>
                            \`;

                            // 添加删除标签的事件
                            const closeBtn = tag.querySelector('.sub-multi-select__tag-close');
                            closeBtn.addEventListener('click', e => {
                                e.stopPropagation();
                                this.#removeValue(value);
                            });

                            wrapper.appendChild(tag);
                        }
                    });
                }

                wrapper.appendChild(arrow);
            }

            #removeValue(value) {
                this.state.value = this.state.value.filter(v => v !== value);
                this.#renderTags(this.shadowRoot.querySelector('.sub-multi-select__wrapper'));
                this.#renderOptions(this.shadowRoot.querySelector('.sub-multi-select__dropdown'));
                this.#dispatchChangeEvent();
            }

            #bindEvents(wrapper, arrow, dropdown) {
                if (this.hasAttribute('disabled')) return;

                const closeDropdown = () => {
                    this.state.isOpen = false;
                    dropdown.classList.remove('sub-multi-select__dropdown_visible');
                    wrapper.classList.remove('sub-multi-select__wrapper_active');
                    arrow.classList.remove('sub-multi-select__arrow_active');
                };

                const handleClickOutside = event => {
                    const isClickInside = wrapper.contains(event.target) || dropdown.contains(event.target);
                    if (!isClickInside && this.state.isOpen) {
                        closeDropdown();
                    }
                };

                document.addEventListener('click', handleClickOutside);

                this.addEventListener('disconnected', () => {
                    document.removeEventListener('click', handleClickOutside);
                });

                const toggleDropdown = () => {
                    if (this.state.isOpen) {
                        closeDropdown();
                    } else {
                        document.dispatchEvent(
                            new CustomEvent('sub-multi-select-toggle', {
                                detail: { currentSelect: this }
                            })
                        );

                        this.state.isOpen = true;
                        dropdown.classList.add('sub-multi-select__dropdown_visible');
                        wrapper.classList.add('sub-multi-select__wrapper_active');
                        arrow.classList.add('sub-multi-select__arrow_active');

                        this.#renderOptions(dropdown);
                    }
                };

                wrapper.addEventListener('click', e => {
                    e.stopPropagation();
                    toggleDropdown();
                });

                document.addEventListener('sub-multi-select-toggle', e => {
                    if (e.detail.currentSelect !== this && this.state.isOpen) {
                        closeDropdown();
                    }
                });
            }

            #renderOptions(dropdown) {
                dropdown.innerHTML = '';

                if (this.state.options.length === 0) {
                    const empty = document.createElement('div');
                    empty.className = 'sub-multi-select__empty';
                    empty.textContent = '暂无数据';
                    dropdown.appendChild(empty);
                    return;
                }

                this.state.options.forEach(option => {
                    const optionEl = document.createElement('div');
                    optionEl.className = 'sub-multi-select__option';

                    const checkbox = document.createElement('span');
                    checkbox.className = 'sub-multi-select__checkbox';
                    if (this.state.value.includes(option.value)) {
                        checkbox.classList.add('sub-multi-select__checkbox_checked');
                        optionEl.classList.add('sub-multi-select__option_selected');
                    }

                    const label = document.createElement('span');
                    label.textContent = option.label;

                    optionEl.appendChild(checkbox);
                    optionEl.appendChild(label);

                    optionEl.addEventListener('click', e => {
                        e.stopPropagation();
                        this.#toggleOption(option);
                    });

                    dropdown.appendChild(optionEl);
                });
            }

            #toggleOption(option) {
                const index = this.state.value.indexOf(option.value);
                if (index === -1) {
                    this.state.value.push(option.value);
                } else {
                    this.state.value.splice(index, 1);
                }

                this.#renderTags(this.shadowRoot.querySelector('.sub-multi-select__wrapper'));
                this.#renderOptions(this.shadowRoot.querySelector('.sub-multi-select__dropdown'));
                this.#dispatchChangeEvent();
            }

            #dispatchChangeEvent() {
                this.dispatchEvent(new Event('change', { bubbles: true }));
                this.dispatchEvent(new Event('input', { bubbles: true }));
                this.dispatchEvent(
                    new CustomEvent('update:value', {
                        detail: {
                            value: [...this.state.value]
                        },
                        bubbles: true
                    })
                );
            }

            #render() {
                this.#injectStyle();
                this.#injectElement();
            }

            get value() {
                return [...this.state.value];
            }

            set value(val) {
                if (Array.isArray(val)) {
                    this.state.value = [...val];
                    this.#renderTags(this.shadowRoot.querySelector('.sub-multi-select__wrapper'));
                    if (this.shadowRoot.querySelector('.sub-multi-select__dropdown')) {
                        this.#renderOptions(this.shadowRoot.querySelector('.sub-multi-select__dropdown'));
                    }
                }
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (oldValue === newValue) return;

                switch (name) {
                    case 'value':
                        try {
                            
                            this.value = JSON.parse(newValue);
                        } catch (e) {
                            console.error('Invalid value format:', e);
                            this.value = [];
                        }
                        break;
                    case 'options':
                        try {
                            this.state.options = JSON.parse(newValue);
                            this.#renderTags(this.shadowRoot.querySelector('.sub-multi-select__wrapper'));
                            if (this.shadowRoot.querySelector('.sub-multi-select__dropdown')) {
                                this.#renderOptions(this.shadowRoot.querySelector('.sub-multi-select__dropdown'));
                            }
                        } catch (e) {
                            console.error('Invalid options format:', e);
                            this.state.options = [];
                        }
                        break;
                    case 'disabled':
                        const wrapper = this.shadowRoot.querySelector('.sub-multi-select__wrapper');
                        if (wrapper) {
                            if (this.hasAttribute('disabled')) {
                                wrapper.classList.add('sub-multi-select__wrapper_disabled');
                            } else {
                                wrapper.classList.remove('sub-multi-select__wrapper_disabled');
                            }
                        }
                        break;
                }
            }
        }

        customElements.define('sub-multi-select', SubMultiSelect);
    <\/script>`;
}
const it = Ct();
function dr() {
  return `
    <script>
        class SubSelect extends HTMLElement {
            static get observedAttributes() {
                return ['value', 'options', 'placeholder', 'disabled', 'filterable'];
            }

            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.#init();
            }

            #render() {
                // 清空 shadowRoot
                this.shadowRoot.innerHTML = '';

                // 注入样式和元素
                this.#injectStyle();
                this.#injectElement();
            }

            get value() {
                return this.state?.value || '';
            }

            set value(val) {
                if (val !== this.state.value) {
                    this.state.value = val;
                    // 更新输入框显示
                    const input = this.shadowRoot.querySelector('.sub-select__input');
                    const option = this.state.options.find(opt => opt.value === val);
                    if (input && option) {
                        input.value = option.label;
                    }
                }
            }

            #init() {
                this.state = {
                    isOpen: false,
                    options: [],
                    value: this.getAttribute('value') || '',
                    filterValue: ''
                };
                this.#render();
            }

            #injectElement() {
                const template = document.createElement('div');
                template.className = 'sub-select';

                // 创建选择框主体
                const wrapper = document.createElement('div');
                wrapper.className = 'sub-select__wrapper';
                if (this.hasAttribute('disabled')) {
                    wrapper.classList.add('sub-select__wrapper_disabled');
                }

                // 创建输入框
                const input = document.createElement('input');
                input.className = 'sub-select__input';
                input.placeholder = this.getAttribute('placeholder') || '请选择';
                input.readOnly = !this.hasAttribute('filterable');

                // 如果有初始值，设置输入框的值
                if (this.state.value) {
                    const option = this.state.options.find(opt => opt.value === this.state.value);
                    if (option) {
                        input.value = option.label;
                    }
                }

                if (this.hasAttribute('disabled')) {
                    input.classList.add('sub-select__input_disabled');
                    input.disabled = true;
                }

                // 创建箭头图标
                const arrow = document.createElement('span');
                arrow.className = 'sub-select__arrow';
                arrow.innerHTML = \`${it.arrow}\`;

                // 创建下拉框
                const dropdown = document.createElement('div');
                dropdown.className = 'sub-select__dropdown';

                // 组装组件
                wrapper.appendChild(input);
                wrapper.appendChild(arrow);
                template.appendChild(wrapper);
                template.appendChild(dropdown);

                this.shadowRoot.appendChild(template);

                // 绑定事件
                this.#bindEvents(wrapper, input, arrow, dropdown);
            }

            #injectStyle() {
                const style = document.createElement('style');
                style.textContent = \`
                    .sub-select {
                        position: relative;
                        display: inline-block;
                        width: 100%;
                        font-size: 14px;
                    }

                    .sub-select__wrapper {
                        position: relative;
                        height: 32px;
                        padding: 0 30px 0 12px;
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius);
                        background-color: var(--background);
                        cursor: pointer;
                        transition: var(--transition);
                    }

                    .sub-select__wrapper:hover {
                        border-color: var(--border-hover);
                    }

                    .sub-select__wrapper_active {
                        border-color: var(--primary-color);
                        box-shadow: 0 0 0 2px var(--shadow);
                    }

                    .sub-select__wrapper_disabled {
                        cursor: not-allowed;
                    }

                    .sub-select__input {
                        width: 100%;
                        height: 100%;
                        border: none;
                        outline: none;
                        background: none;
                        padding: 0;
                        margin: 0;
                        color: var(--text-primary);
                        cursor: inherit;
                    }

                    .sub-select__input::placeholder {
                        color: var(--text-secondary);
                    }

                    .sub-select__input_disabled {
                        cursor: not-allowed;
                        color: #c0c4cc;
                    }

                    .sub-select__input_placeholder {
                        color: var(--text-secondary);
                    }

                    .sub-select__arrow {
                        position: absolute;
                        right: 8px;
                        top: 50%;
                        transform: translateY(-50%);
                        color: #c0c4cc;
                        transition: transform .3s;
                    }

                    .sub-select__arrow_active {
                        transform: translateY(-50%) rotate(180deg);
                    }

                    .sub-select__dropdown {
                        position: absolute;
                        top: calc(100% + 8px);
                        left: 0;
                        width: 100%;
                        max-height: 274px;
                        padding: 6px 0;
                        background: var(--background);
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius);
                        box-shadow: 0 4px 12px var(--shadow);
                        box-sizing: border-box;
                        margin: 0;
                        opacity: 0;
                        transform: scaleY(0);
                        transform-origin: center top;
                        transition: .3s cubic-bezier(.645,.045,.355,1);
                        z-index: 1000;
                        overflow-y: auto;
                    }

                    .sub-select__dropdown_visible {
                        opacity: 1;
                        transform: scaleY(1);
                    }

                    .sub-select__option {
                        position: relative;
                        padding: 0 32px 0 12px;
                        height: 34px;
                        line-height: 34px;
                        color: var(--text-primary);
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        cursor: pointer;
                    }

                    .sub-select__option:hover {
                        background-color: var(--background-secondary);
                    }

                    .sub-select__option_selected {
                        color: var(--primary-color);
                        background-color: var(--background-secondary);
                    }

                    .sub-select__option_custom {
                        color: #409eff;
                    }

                    .sub-select__empty {
                        padding: 32px 0;
                        text-align: center;
                        color: #909399;
                    }

                    .sub-select__empty-icon {
                        margin-bottom: 8px;
                    }
                \`;
                this.shadowRoot.appendChild(style);
            }

            #bindEvents(wrapper, input, arrow, dropdown) {
                if (this.hasAttribute('disabled')) return;

                const closeDropdown = () => {
                    this.state.isOpen = false;
                    dropdown.classList.remove('sub-select__dropdown_visible');
                    wrapper.classList.remove('sub-select__wrapper_active');
                    arrow.classList.remove('sub-select__arrow_active');
                };

                // 添加全局点击事件监听
                const handleClickOutside = event => {
                    const isClickInside = wrapper.contains(event.target) || dropdown.contains(event.target);
                    if (!isClickInside && this.state.isOpen) {
                        closeDropdown();
                        if (this.hasAttribute('filterable')) {
                            // 如果没有输入新的值，恢复原来的值
                            if (!this.state.filterValue) {
                                const option = this.state.options.find(opt => opt.value === this.state.value);
                                if (option) {
                                    input.value = option.label;
                                }
                            }
                        }
                        this.state.filterValue = '';
                    }
                };

                // 在组件连接到 DOM 时添加事件监听
                document.addEventListener('click', handleClickOutside);

                // 在组件断开连接时移除事件监听，防止内存泄漏
                this.addEventListener('disconnected', () => {
                    document.removeEventListener('click', handleClickOutside);
                });

                const toggleDropdown = () => {
                    if (this.state.isOpen) {
                        closeDropdown();
                        if (this.hasAttribute('filterable')) {
                            // 如果没有输入新的值，恢复原来的值
                            if (!this.state.filterValue) {
                                const option = this.state.options.find(opt => opt.value === this.state.value);
                                if (option) {
                                    input.value = option.label;
                                }
                            }
                        }
                        this.state.filterValue = '';
                    } else {
                        // 触发全局事件，通知其他 select 关闭
                        document.dispatchEvent(
                            new CustomEvent('sub-select-toggle', {
                                detail: { currentSelect: this }
                            })
                        );

                        this.state.isOpen = true;
                        dropdown.classList.add('sub-select__dropdown_visible');
                        wrapper.classList.add('sub-select__wrapper_active');
                        arrow.classList.add('sub-select__arrow_active');

                        // 如果是可过滤的，保存当前值为 placeholder 并清空输入框
                        if (this.hasAttribute('filterable')) {
                            const currentValue = input.value;
                            input.placeholder = currentValue;
                            input.value = '';
                            input.focus();
                        }

                        this.#renderOptions(dropdown);
                    }
                };

                wrapper.addEventListener('click', e => {
                    e.stopPropagation();
                    toggleDropdown();
                });

                // 监听全局事件，当其他 select 打开时关闭当前 select
                document.addEventListener('sub-select-toggle', e => {
                    if (e.detail.currentSelect !== this && this.state.isOpen) {
                        closeDropdown();
                        if (this.hasAttribute('filterable')) {
                            // 如果没有输入新的值，恢复原来的值
                            if (!this.state.filterValue) {
                                const option = this.state.options.find(opt => opt.value === this.state.value);
                                if (option) {
                                    input.value = option.label;
                                }
                            }
                        }
                        this.state.filterValue = '';
                    }
                });

                if (this.hasAttribute('filterable')) {
                    input.addEventListener('input', e => {
                        e.stopPropagation();
                        this.state.filterValue = e.target.value;
                        if (!this.state.isOpen) {
                            toggleDropdown();
                        } else {
                            this.#renderOptions(dropdown);
                        }
                    });
                }
            }

            #renderOptions(dropdown) {
                dropdown.innerHTML = '';
                let options = [...this.state.options];  // 创建一个副本，避免直接修改原数组

                // 如果是过滤模式且有输入值
                if (this.hasAttribute('filterable') && this.state.filterValue) {
                    // 过滤匹配的选项
                    const filteredOptions = options.filter(option => 
                        option.label.toLowerCase().includes(this.state.filterValue.toLowerCase())
                    );

                    // 如果没有匹配的选项，添加自定义选项
                    if (filteredOptions.length === 0) {
                        const customOption = document.createElement('div');
                        customOption.className = 'sub-select__option sub-select__option_custom';
                        customOption.textContent = this.state.filterValue;
                        customOption.addEventListener('click', e => {
                            e.stopPropagation();
                            this.#selectOption({
                                value: this.state.filterValue,
                                label: this.state.filterValue
                            });
                        });
                        dropdown.appendChild(customOption);
                        return;
                    }

                    // 显示过滤后的选项
                    options = filteredOptions;
                }

                // 如果没有选项，显示空状态
                if (options.length === 0) {
                    const empty = document.createElement('div');
                    empty.className = 'sub-select__empty';
                    empty.innerHTML = \`
                        <div class="sub-select__empty-icon">${it.empty}</div>
                        <div>暂无数据</div>
                    \`;
                    dropdown.appendChild(empty);
                    return;
                }

                // 渲染选项列表
                options.forEach(option => {
                    const optionEl = document.createElement('div');
                    optionEl.className = 'sub-select__option';
                    if (option.value === this.state.value) {
                        optionEl.classList.add('sub-select__option_selected');
                    }
                    optionEl.textContent = option.label;
                    optionEl.addEventListener('click', e => {
                        e.stopPropagation();
                        this.#selectOption(option);
                    });
                    dropdown.appendChild(optionEl);
                });
            }

            #selectOption(option) {
                this.state.value = option.value;
                const input = this.shadowRoot.querySelector('.sub-select__input');
                input.value = option.label;

                // 如果是自定义选项，添加到选项列表中
                if (!this.state.options.some(opt => opt.value === option.value)) {
                    this.state.options = [...this.state.options, option];
                }

                // 清空过滤值
                this.state.filterValue = '';

                // 关闭下拉框
                const wrapper = this.shadowRoot.querySelector('.sub-select__wrapper');
                const arrow = this.shadowRoot.querySelector('.sub-select__arrow');
                const dropdown = this.shadowRoot.querySelector('.sub-select__dropdown');
                dropdown.classList.remove('sub-select__dropdown_visible');
                wrapper.classList.remove('sub-select__wrapper_active');
                arrow.classList.remove('sub-select__arrow_active');
                this.state.isOpen = false;

                // 触发事件通知外部值变化
                this.dispatchEvent(new Event('change', { bubbles: true }));
                this.dispatchEvent(new Event('input', { bubbles: true }));
                // 触发 update:value 事件，用于表单数据同步
                this.dispatchEvent(
                    new CustomEvent('update:value', {
                        detail: {
                            value: option.value,
                            option
                        },
                        bubbles: true
                    })
                );
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (name === 'options' && newValue !== oldValue) {
                    try {
                        this.state.options = JSON.parse(newValue);
                        // 设置初始值
                        if (this.state.value) {
                            const input = this.shadowRoot.querySelector('.sub-select__input');
                            const option = this.state.options.find(opt => opt.value === this.state.value);
                            if (option && input) {
                                input.value = option.label;
                            }
                        }
                        if (this.shadowRoot.querySelector('.sub-select__dropdown')) {
                            this.#renderOptions(this.shadowRoot.querySelector('.sub-select__dropdown'));
                        }
                    } catch (e) {
                        console.error('Invalid options format:', e);
                        this.state.options = [];
                    }
                } else if (name === 'value' && newValue !== oldValue) {
                    this.state.value = newValue;
                    const input = this.shadowRoot.querySelector('.sub-select__input');
                    const option = this.state.options.find(opt => opt.value === newValue);
                    if (option && input) {
                        input.value = option.label;
                    }
                } else if (name === 'disabled' && newValue !== oldValue) {
                    const input = this.shadowRoot.querySelector('.sub-select__input');
                    if (newValue) {
                        input.disabled = true;
                    } else {
                        input.disabled = false;
                    }
                }
            }
        }

        customElements.define('sub-select', SubSelect);
    <\/script>`;
}
function hr() {
  return `
    <script>
        class SubTextarea extends HTMLElement {
            static get observedAttributes() {
                return ['value', 'placeholder', 'disabled', 'rows', 'key'];
            }

            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.state = {
                    value: this.getAttribute('value') || ''
                };
                this.#render();
            }

            #injectStyle() {
                const style = document.createElement('style');
                style.textContent = \`
                    :host {
                        display: inline-block;
                        width: 100%;
                        vertical-align: bottom;
                        font-size: 14px;
                    }
                    .sub-textarea {
                        position: relative;
                        display: inline-block;
                        width: 100%;
                    }
                    .sub-textarea__inner {
                        display: block;
                        resize: vertical;
                        padding: 5px 15px;
                        line-height: 1.5;
                        box-sizing: border-box;
                        width: 100%;
                        font-size: inherit;
                        color: var(--text-primary);
                        background-color: var(--background);
                        background-image: none;
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius);
                        transition: var(--transition);
                        font-family: inherit;
                    }
                    .sub-textarea__inner:focus {
                        outline: none;
                        border-color: var(--primary-color);
                        box-shadow: 0 0 0 2px var(--shadow);
                    }
                    .sub-textarea__inner:hover {
                        border-color: var(--border-hover);
                    }
                    .sub-textarea__inner::placeholder {
                        color: var(--text-secondary);
                    }
                    .sub-textarea__inner:disabled {
                        background-color: var(--background-disabled);
                        border-color: var(--border-color);
                        color: var(--text-disabled);
                        cursor: not-allowed;
                    }
                \`;
                this.shadowRoot.appendChild(style);
            }

            #injectElement() {
                const wrapper = document.createElement('div');
                wrapper.className = 'sub-textarea';

                const textarea = document.createElement('textarea');
                textarea.className = 'sub-textarea__inner';
                textarea.value = this.state.value;
                textarea.placeholder = this.getAttribute('placeholder') || '';
                textarea.rows = this.getAttribute('rows') || 2;
                textarea.disabled = this.hasAttribute('disabled');

                wrapper.appendChild(textarea);
                this.shadowRoot.appendChild(wrapper);

                this.#bindEvents(textarea);
            }

            #bindEvents(textarea) {
                textarea.addEventListener('input', e => {
                    this.state.value = e.target.value;
                    // 触发原生事件
                    this.dispatchEvent(new Event('input', { bubbles: true }));
                    this.dispatchEvent(new Event('change', { bubbles: true }));
                    // 触发自定义事件
                    this.dispatchEvent(
                        new CustomEvent('update:value', {
                            detail: {
                                value: e.target.value
                            },
                            bubbles: true
                        })
                    );
                });
            }

            #render() {
                this.#injectStyle();
                this.#injectElement();
            }

            // 提供 value 的 getter/setter
            get value() {
                return this.state.value;
            }

            set value(val) {
                if (val !== this.state.value) {
                    this.state.value = val;
                    const textarea = this.shadowRoot.querySelector('textarea');
                    if (textarea) {
                        textarea.value = val;
                    }
                }
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (oldValue === newValue) return;

                const textarea = this.shadowRoot.querySelector('textarea');
                if (!textarea) return;

                switch (name) {
                    case 'value':
                        this.value = newValue;
                        break;
                    case 'placeholder':
                        textarea.placeholder = newValue;
                        break;
                    case 'disabled':
                        textarea.disabled = this.hasAttribute('disabled');
                        break;
                    case 'rows':
                        textarea.rows = newValue;
                        break;
                }
            }
        }
        customElements.define('sub-textarea', SubTextarea);
    <\/script>
    `;
}
function fr() {
  return [
    { label: "Emoji", value: "emoji" },
    { label: "Clash New Field", value: "new_name" },
    { label: "启用 UDP", value: "udp" },
    { label: "排序节点", value: "sort" },
    { label: "启用TFO", value: "tfo" }
  ];
}
function mr(e, t) {
  var i;
  const { origin: r } = new URL(e.url);
  return (((i = t.BACKEND) == null ? void 0 : i.split(`
`).filter(Boolean)) ?? []).reduce(
    (o, s) => (o.unshift({ label: s, value: s }), o),
    [
      { label: r, value: r },
      { label: "肥羊增强型后端【vless+hysteria】", value: "https://api.v1.mk" },
      { label: "肥羊备用后端【vless+hysteria】", value: "https://sub.d1.mk" },
      { label: "品云提供后端【实验性】", value: "https://v.id9.cc" },
      { label: "つつ-多地防失联【负载均衡+国内优化】", value: "https://api.tsutsu.one" },
      { label: "nameless13提供", value: "https://www.nameless13.com" },
      { label: "subconverter作者提供", value: "https://sub.xeton.dev" },
      { label: "sub-web作者提供", value: "https://api.wcc.best" },
      { label: "sub作者&lhie1提供", value: "https://api.dler.io" }
    ]
  );
}
function br() {
  return [
    { label: "Vless", value: "vless" },
    { label: "Vmess", value: "vmess" },
    { label: "Trojan", value: "trojan" },
    { label: "Shadowsocks", value: "shadowsocks" },
    { label: "ShadowsocksR", value: "shadowsocksr" },
    { label: "Hysteria", value: "hysteria" },
    { label: "Hysteria2", value: "hysteria2" },
    { label: "HY2", value: "hy2" }
  ];
}
function gr(e) {
  var r;
  return (((r = e.REMOTE_CONFIG) == null ? void 0 : r.split(`
`).filter(Boolean)) ?? []).reduce(
    (n, i) => (n.unshift({
      label: i,
      value: i
    }), n),
    [
      {
        label: "ACL4SSR_Online 默认版 分组比较全 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online.ini"
      },
      {
        label: "ACL4SSR_Online_AdblockPlus 更多去广告 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_AdblockPlus.ini"
      },
      {
        label: "ACL4SSR_Online_NoAuto 无自动测速 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_NoAuto.ini"
      },
      {
        label: "ACL4SSR_Online_NoReject 无广告拦截规则 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_NoReject.ini"
      },
      {
        label: "ACL4SSR_Online_Mini 精简版 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini.ini"
      },
      {
        label: "ACL4SSR_Online_Mini_AdblockPlus.ini 精简版 更多去广告 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_AdblockPlus.ini"
      },
      {
        label: "ACL4SSR_Online_Mini_NoAuto.ini 精简版 不带自动测速 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_NoAuto.ini"
      },
      {
        label: "ACL4SSR_Online_Mini_Fallback.ini 精简版 带故障转移 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_Fallback.ini"
      },
      {
        label: "ACL4SSR_Online_Mini_MultiMode.ini 精简版 自动测速、故障转移、负载均衡 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_MultiMode.ini"
      },
      {
        label: "ACL4SSR_Online_Full 全分组 重度用户使用 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full.ini"
      },
      {
        label: "ACL4SSR_Online_Full_NoAuto.ini 全分组 无自动测速 重度用户使用 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_NoAuto.ini"
      },
      {
        label: "ACL4SSR_Online_Full_AdblockPlus 全分组 重度用户使用 更多去广告 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_AdblockPlus.ini"
      },
      {
        label: "ACL4SSR_Online_Full_Netflix 全分组 重度用户使用 奈飞全量 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_Netflix.ini"
      }
    ]
  );
}
function vr(e, t) {
  if (t.DB === void 0)
    return [];
  const { origin: r } = new URL(e.url);
  return [{ label: r, value: r }];
}
function xr() {
  return `
        <script>
            // 检测系统主题
            function detectSystemTheme() {
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    return 'dark';
                }
                return 'light';
            }

            // 设置主题
            function setTheme(theme) {
                if (theme === 'dark') {
                    document.documentElement.setAttribute('theme', 'dark');
                } else {
                    document.documentElement.removeAttribute('theme');
                }
                localStorage.setItem('theme', theme);
            }

            // 初始化主题
            function initTheme() {
                const savedTheme = localStorage.getItem('theme');
                if (savedTheme) {
                    setTheme(savedTheme);
                } else {
                    setTheme(detectSystemTheme());
                }
            }

            // 监听系统主题变化
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                if (!localStorage.getItem('theme')) {
                    setTheme(e.matches ? 'dark' : 'light');
                }
            });

            // 页面加载时初始化主题
            document.addEventListener('DOMContentLoaded', () => {
                initTheme();

                // 添加主题切换按钮
                const toggleBtn = document.querySelector('.header__theme');
                toggleBtn.onclick = () => {
                    const isDark = document.documentElement.hasAttribute('theme');
                    setTheme(isDark ? 'light' : 'dark');
                };
            });
        <\/script>
    `;
}
function wr() {
  return `
        <style>
            html,
            body {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', Arial, sans-serif;
                background-color: var(--background);
                color: var(--text-primary);
                transition: var(--transition);
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
            }

            /* 调整主体内容的布局 */
            main {
                width: 70%;
                max-width: 1200px;
                margin: 0 auto;
                margin-top: 20px;
                border: 1px solid var(--border-color);
                border-radius: var(--radius);
            }

            main > header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 10px;
                border-bottom: 1px solid var(--border-color);
                padding: 10px 15px;
            }

            main > header > .header__icon {
                width: 25px;
                height: 25px;
                cursor: pointer;
                transition: var(--transition);
            }

            main > header > .header__icon svg {
                width: 100%;
                height: 100%;
            }

            main > header > .header__iconsvg path {
                fill: var(--text-primary); /* 使用主题文字颜色 */
                transition: var(--transition);
            }

            main > header > .header__icon:hover svg path {
                fill: var(--primary-color); /* 悬浮时使用主题主色 */
            }

            /* 暗色主题下的样式 */
            :root[theme='dark'] main > header > .header__icon svg path {
                fill: var(--text-primary);
            }

            :root[theme='dark'] main > header > .header__icon:hover svg path {
                fill: var(--primary-color);
            }

            main > header > .header__title {
                font-size: 18px;
                font-weight: 600;
                color: var(--text-primary);
                text-align: center;
            }

            /* 主题切换按钮样式优化 */
            main > header > .header__theme {
                padding: 5px 10px;
                border-radius: var(--radius);
                border: 1px solid var(--border-color);
                background: var(--background);
                color: var(--text-primary);
                cursor: pointer;
                font-size: 14px;
                transition: var(--transition);
                display: flex;
                align-items: center;
                gap: 6px;
            }

            main > header > .header__theme:hover {
                border-color: var(--primary-color);
                color: var(--primary-color);
            }

            /* 添加主题图标 */
            main > header > .header__theme::before {
                content: '';
                width: 16px;
                height: 16px;
                background-image: var(--theme-icon);
                background-size: contain;
                background-repeat: no-repeat;
                transition: var(--transition);
            }

            /* 暗色主题图标 */
            :root[theme='dark'] main > header > .header__theme::before {
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z'/%3E%3C/svg%3E");
            }

            /* 亮色主题图标 */
            :root:not([theme='dark']) main > header > .header__theme::before {
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000000'%3E%3Cpath d='M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z'/%3E%3C/svg%3E");
            }

            main > section {
                margin-top: 20px;
                padding: 0 20px;
            }
        
        </style>`;
}
function yr() {
  return `
    <style>
        /* 全局主题变量 */
        :root {
            /* Light Theme */
            --primary-color: #007aff;
            --primary-hover: #3395ff;
            --primary-active: #0056b3;
            --text-primary: #000000;
            --text-secondary: #666666;
            --text-disabled: #999999;
            --border-color: #9f9fa7;
            --border-hover: #b8b8bd;
            --background: #ffffff;
            --background-secondary: #f5f5f5;
            --background-disabled: #f2f2f7;
            --shadow: rgba(0, 0, 0, 0.1);
            --radius: 8px;
            --transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        }

        /* Dark Theme */
        :root[theme='dark'] {
            --primary-color: #0a84ff;
            --primary-hover: #409cff;
            --primary-active: #0066cc;
            --text-primary: #ffffff;
            --text-secondary: #98989d;
            --text-disabled: #666666;
            --border-color: #9494a6;
            --border-hover: #48484c;
            --background: #1c1c1e;
            --background-secondary: #2c2c2e;
            --background-disabled: #38383c;
            --shadow: rgba(0, 0, 0, 0.3);
        }
    </style>
    `;
}
function Cr(e, t) {
  var d;
  const r = gr(t), n = mr(e, t), i = vr(e, t), o = yt(), s = fr(), a = br(), l = t.DB !== void 0, c = `  
    <!DOCTYPE html>
        <html lang="en" theme="dark">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Sub Converter</title>

                ${yr()}
                ${wr()}

                <style>
                    .input-group {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }

                    .input-group input {
                        width: 100%;
                        padding: 4px 11px;
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius);
                        transition: var(--transition);
                        min-height: 32px;
                        box-sizing: border-box;
                        flex: 1;
                        background-color: var(--background);
                        color: var(--text-disabled);
                        cursor: not-allowed;
                    }

                    .input-group input:disabled {
                        border-color: var(--border-color);
                        background-color: var(--background-disabled);
                        color: var(--text-disabled);
                        opacity: 1;
                    }

                    .sub-form-item__actions {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        gap: 20px;
                        margin-top: 24px;
                        padding-right: 100px;
                    }
                </style>
            </head>
            <body>
                ${xr()}

                <main>
                    <header>
                        <span class="header__icon">
                            <svg
                                t="1735896323200"
                                class="icon"
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                p-id="1626"
                            >
                                <path
                                    d="M512 42.666667A464.64 464.64 0 0 0 42.666667 502.186667 460.373333 460.373333 0 0 0 363.52 938.666667c23.466667 4.266667 32-9.813333 32-22.186667v-78.08c-130.56 27.733333-158.293333-61.44-158.293333-61.44a122.026667 122.026667 0 0 0-52.053334-67.413333c-42.666667-28.16 3.413333-27.733333 3.413334-27.733334a98.56 98.56 0 0 1 71.68 47.36 101.12 101.12 0 0 0 136.533333 37.973334 99.413333 99.413333 0 0 1 29.866667-61.44c-104.106667-11.52-213.333333-50.773333-213.333334-226.986667a177.066667 177.066667 0 0 1 47.36-124.16 161.28 161.28 0 0 1 4.693334-121.173333s39.68-12.373333 128 46.933333a455.68 455.68 0 0 1 234.666666 0c89.6-59.306667 128-46.933333 128-46.933333a161.28 161.28 0 0 1 4.693334 121.173333A177.066667 177.066667 0 0 1 810.666667 477.866667c0 176.64-110.08 215.466667-213.333334 226.986666a106.666667 106.666667 0 0 1 32 85.333334v125.866666c0 14.933333 8.533333 26.88 32 22.186667A460.8 460.8 0 0 0 981.333333 502.186667 464.64 464.64 0 0 0 512 42.666667"
                                    fill="#231F20"
                                    p-id="1627"
                                ></path>
                            </svg>
                        </span>

                        <span class="header__title">订阅转换</span>

                        <button class="header__theme"></button>
                    </header>

                    <section>
                        <sub-form id="sub-convert-form" label-width="100px">
                            <sub-form-item label="订阅链接">
                                <sub-textarea
                                    key="url"
                                    placeholder="支持各种订阅链接或单节点链接，多个链接每行一个或用 | 分隔"
                                    rows="4"
                                ></sub-textarea>
                            </sub-form-item>

                            <sub-form-item label="生成类型">
                                <sub-select key="target"></sub-select>
                            </sub-form-item>

                            <sub-form-item label="远程配置">
                                <sub-select key="config" filterable></sub-select>
                            </sub-form-item>

                            <sub-form-item label="后端地址">
                                <sub-select key="backend" filterable></sub-select>
                            </sub-form-item>

                            <sub-form-item label="包含节点">
                                <sub-multi-select key="protocol"></sub-multi-select>
                            </sub-form-item>

                            <sub-form-item label="高级选项">
                                <sub-checkbox key="advanced" span="5"></sub-checkbox>
                            </sub-form-item>

                            <sub-form-item label="短链地址">
                                <sub-select key="shortServe" filterable placeholder="${l ? "" : "未配置数据库"}"></sub-select>
                            </sub-form-item>

                            <sub-form-item label="定制订阅">
                                <div class="input-group">
                                    <input type="text" value="" disabled id="form-subscribe" />
                                    <sub-button type="default" onclick="sub.copySubUrl('form-subscribe')">
                                        <svg
                                            viewBox="64 64 896 896"
                                            focusable="false"
                                            data-icon="copy"
                                            width="1em"
                                            height="1em"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z"
                                            ></path>
                                        </svg>
                                        复制
                                    </sub-button>
                                </div>
                            </sub-form-item>

                            <sub-form-item label="订阅短链">
                                <div class="input-group">
                                    <input type="text" value="" disabled id="form-short-url" />
                                    <sub-button type="default" onclick="sub.copySubUrl('form-short-url')">
                                        <svg
                                            viewBox="64 64 896 896"
                                            focusable="false"
                                            data-icon="copy"
                                            width="1em"
                                            height="1em"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z"
                                            ></path>
                                        </svg>
                                        复制
                                    </sub-button>
                                </div>
                            </sub-form-item>

                            <sub-form-item>
                                <div class="sub-form-item__actions">
                                    <sub-button disabled id="generate-sub-btn" type="default">生成订阅链接</sub-button>
                                    <sub-button disabled id="generate-short-url-btn" type="default">生成短链</sub-button>
                                </div>
                            </sub-form-item>
                        </sub-form>
                    </section>
                </main>

                ${lr()}
                ${hr()}
                ${dr()}
                ${pr()}
                ${or()}
                ${ar()}
                ${sr()}
                ${nr()}
                ${cr()}

                <script>
                    const formConfig = {
                        target: {
                            type: 'sub-select',
                            options: ${JSON.stringify(o)}
                        },
                        config: {
                            type: 'sub-select',
                            options: ${JSON.stringify(r)}
                        },
                        backend: {
                            type: 'sub-select',
                            options: ${JSON.stringify(n)}
                        },
                        protocol: {
                            type: 'sub-multi-select',
                            options: ${JSON.stringify(a)}
                        },
                        advanced: {
                            type: 'sub-checkbox',
                            options: ${JSON.stringify(s)}
                        },
                        shortServe: {
                            type: 'sub-select',
                            options: ${JSON.stringify(i)}
                        }
                    };

                    class Sub {
                        #model = {
                            target: '${o[0].value}',
                            config: '${r[0].value}',
                            backend: '${n[0].value}',
                            protocol: '${JSON.stringify(a.map((p) => p.value))}',
                            advanced: ['emoji', 'new_name'],
                            shortServe: '${((d = i[0]) == null ? void 0 : d.value) ?? ""}',

                            subUrl: '',
                            shortUrl: ''
                        };

                        #formSubscribe = this.#$('#form-subscribe');
                        #formShortUrl = this.#$('#form-short-url');

                        #generateSubBtn = this.#$('#generate-sub-btn');
                        #generateShortUrlBtn = this.#$('#generate-short-url-btn');

                        #form = this.#$('#sub-convert-form');
                        #formItems = this.#form.querySelectorAll('sub-form-item');

                        #headerIcon = this.#$('.header__icon');

                        constructor() {
                            this.#init();
                            this.#bindEvents();
                        }

                        #init() {
                            this.#formItems.forEach(item => {
                                const formItem = item.querySelector('[key]');
                                if (formItem) {
                                    const formItemKey = formItem.getAttribute('key');
                                    const type = formConfig[formItemKey]?.type;
                                    if (type && ['sub-select', 'sub-checkbox', 'sub-multi-select'].includes(type)) {
                                        formItem.setAttribute('options', JSON.stringify(formConfig[formItemKey].options));
                                    }

                                    if(formItemKey === 'shortServe' && ${!l}) {
                                        formItem.setAttribute('disabled', 'true');
                                    }

                                    formItem.setAttribute('placeholder', formConfig[formItemKey]?.placeholder ?? '');
                                    if (formConfig[formItemKey]?.disabled) {
                                        formItem.setAttribute('disabled', '');
                                    }
                                }
                            });

                            this.#form.setAttribute('model', JSON.stringify(this.#model));
                        }

                        #bindEvents() {

                            this.#headerIcon.addEventListener('click', () => {
                                window.open('https://github.com/jwyGithub/sub-convert');
                            });


                            this.#form.addEventListener('form:change', e => {
                                this.#model[e.detail.key] = e.detail.value;
                                this.#form.setAttribute('model', JSON.stringify(this.#model));

                                if (this.#model.url) {
                                    this.#generateSubBtn.removeAttribute('disabled');
                                } else {
                                    this.#generateSubBtn.setAttribute('disabled', '');
                                }
                            });

                            this.#generateSubBtn.addEventListener('click', () => {
                                const url = new URL(this.#model.backend + '/sub');
                                url.searchParams.set('target', this.#model.target);
                                url.searchParams.set('url', this.#model.url);
                                url.searchParams.set('insert', 'false');
                                url.searchParams.set('config', this.#model.config);
                                url.searchParams.set('list', false);
                                url.searchParams.set('scv', false);
                                url.searchParams.set('fdn', false);
                                url.searchParams.set('protocol', Array.isArray(this.#model.protocol) ? JSON.stringify(this.#model.protocol) : this.#model.protocol);
                                
                                const advancedOptions = this.#getAdvancedOptions(this.#model);

                                advancedOptions.forEach(option => {
                                    url.searchParams.set(option.label, option.value);
                                });

                                const subUrl = url.toString();
                                this.#formSubscribe.value = subUrl;
                                this.#model.subUrl = subUrl;

                                this.#generateShortUrlBtn.removeAttribute('disabled');
                            });



                            this.#generateShortUrlBtn.addEventListener('click', async () => {
                                if (!this.#model.shortServe) {
                                    notification.error('短链服务不存在');
                                    return;
                                }

                                // 构建请求数据
                                const requestData = {
                                    serve: this.#model.shortServe,
                                    long_url: this.#model.subUrl
                                };

                                // 发送请求
                                const response = await fetch(\`\${this.#model.shortServe}/api/add\`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(requestData)
                                });

                                if (response.ok) {
                                    const data = await response.json();
                                    this.#formShortUrl.value = data.data.short_url;
                                    this.#model.shortUrl = data.data.short_url;
                                    notification.success('生成短链接成功');
                                } else {
                                    notification.error('生成短链接失败');
                                }
                            });
                        }

                        #getAdvancedOptions(model) {
                            return formConfig.advanced.options.map(option => {
                                return {
                                    label: option.value,
                                    value: model.advanced.includes(option.value)
                                };
                            });
                        }

                        /**
                         * 获取元素
                         * @param {string} selector
                         * @returns {HTMLElement}
                         */
                        #$(selector) {
                            return document.querySelector(selector);
                        }

                        async copySubUrl(dom) {
                            const text = this.#$(\`#\${dom}\`).value;
                            if (!text) {
                                notification.error('复制内容不能为空');
                                return;
                            }

                            const success = await this.copyToClipboard(text);
                            if (success) {
                                notification.success('复制成功');
                            }
                        }

                        async copyToClipboard(text) {
                            try {
                                if (navigator.clipboard && window.isSecureContext) {
                                    // 优先使用 Clipboard API
                                    await navigator.clipboard.writeText(text);
                                    return true;
                                } else {
                                    // 降级使用 document.execCommand
                                    const textArea = document.createElement('textarea');
                                    textArea.value = text;
                                    textArea.style.position = 'fixed';
                                    textArea.style.left = '-999999px';
                                    textArea.style.top = '-999999px';
                                    document.body.appendChild(textArea);
                                    textArea.focus();
                                    textArea.select();

                                    const success = document.execCommand('copy');
                                    textArea.remove();

                                    if (!success) {
                                        throw new Error('复制失败');
                                    }
                                    return true;
                                }
                            } catch (error) {
                                notification.error('复制失败: ' + (error.message || '未知错误'));
                                return false;
                            }
                        }
                    }

                    const sub = new Sub();

                <\/script>

        

            </body>
        </html>
    `;
  return new Response(c, {
    headers: new Headers({
      "Content-Type": "text/html; charset=UTF-8"
    })
  });
}
/*! js-yaml 4.1.0 https://github.com/nodeca/js-yaml @license MIT */
function _t(e) {
  return typeof e > "u" || e === null;
}
function _r(e) {
  return typeof e == "object" && e !== null;
}
function Sr(e) {
  return Array.isArray(e) ? e : _t(e) ? [] : [e];
}
function Ar(e, t) {
  var r, n, i, o;
  if (t)
    for (o = Object.keys(t), r = 0, n = o.length; r < n; r += 1)
      i = o[r], e[i] = t[i];
  return e;
}
function Er(e, t) {
  var r = "", n;
  for (n = 0; n < t; n += 1)
    r += e;
  return r;
}
function kr(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
var Lr = _t, Or = _r, Tr = Sr, Rr = Er, Nr = kr, Ir = Ar, S = {
  isNothing: Lr,
  isObject: Or,
  toArray: Tr,
  repeat: Rr,
  isNegativeZero: Nr,
  extend: Ir
};
function St(e, t) {
  var r = "", n = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (r += 'in "' + e.mark.name + '" '), r += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (r += `

` + e.mark.snippet), n + " " + r) : n;
}
function ge(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = St(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
ge.prototype = Object.create(Error.prototype);
ge.prototype.constructor = ge;
ge.prototype.toString = function(t) {
  return this.name + ": " + St(this, t);
};
var T = ge;
function Ve(e, t, r, n, i) {
  var o = "", s = "", a = Math.floor(i / 2) - 1;
  return n - t > a && (o = " ... ", t = n - a + o.length), r - n > a && (s = " ...", r = n + a - s.length), {
    str: o + e.slice(t, r).replace(/\t/g, "→") + s,
    pos: n - t + o.length
    // relative position
  };
}
function je(e, t) {
  return S.repeat(" ", t - e.length) + e;
}
function Fr(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var r = /\r?\n|\r|\0/g, n = [0], i = [], o, s = -1; o = r.exec(e.buffer); )
    i.push(o.index), n.push(o.index + o[0].length), e.position <= o.index && s < 0 && (s = n.length - 2);
  s < 0 && (s = n.length - 1);
  var a = "", l, c, d = Math.min(e.line + t.linesAfter, i.length).toString().length, p = t.maxLength - (t.indent + d + 3);
  for (l = 1; l <= t.linesBefore && !(s - l < 0); l++)
    c = Ve(
      e.buffer,
      n[s - l],
      i[s - l],
      e.position - (n[s] - n[s - l]),
      p
    ), a = S.repeat(" ", t.indent) + je((e.line - l + 1).toString(), d) + " | " + c.str + `
` + a;
  for (c = Ve(e.buffer, n[s], i[s], e.position, p), a += S.repeat(" ", t.indent) + je((e.line + 1).toString(), d) + " | " + c.str + `
`, a += S.repeat("-", t.indent + d + 3 + c.pos) + `^
`, l = 1; l <= t.linesAfter && !(s + l >= i.length); l++)
    c = Ve(
      e.buffer,
      n[s + l],
      i[s + l],
      e.position - (n[s] - n[s + l]),
      p
    ), a += S.repeat(" ", t.indent) + je((e.line + l + 1).toString(), d) + " | " + c.str + `
`;
  return a.replace(/\n$/, "");
}
var Pr = Fr, Mr = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
], Dr = [
  "scalar",
  "sequence",
  "mapping"
];
function Ur(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(r) {
    e[r].forEach(function(n) {
      t[String(n)] = r;
    });
  }), t;
}
function Hr(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(r) {
    if (Mr.indexOf(r) === -1)
      throw new T('Unknown option "' + r + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(r) {
    return r;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = Ur(t.styleAliases || null), Dr.indexOf(this.kind) === -1)
    throw new T('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var E = Hr;
function nt(e, t) {
  var r = [];
  return e[t].forEach(function(n) {
    var i = r.length;
    r.forEach(function(o, s) {
      o.tag === n.tag && o.kind === n.kind && o.multi === n.multi && (i = s);
    }), r[i] = n;
  }), r;
}
function Br() {
  var e = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, t, r;
  function n(i) {
    i.multi ? (e.multi[i.kind].push(i), e.multi.fallback.push(i)) : e[i.kind][i.tag] = e.fallback[i.tag] = i;
  }
  for (t = 0, r = arguments.length; t < r; t += 1)
    arguments[t].forEach(n);
  return e;
}
function ze(e) {
  return this.extend(e);
}
ze.prototype.extend = function(t) {
  var r = [], n = [];
  if (t instanceof E)
    n.push(t);
  else if (Array.isArray(t))
    n = n.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (r = r.concat(t.implicit)), t.explicit && (n = n.concat(t.explicit));
  else
    throw new T("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  r.forEach(function(o) {
    if (!(o instanceof E))
      throw new T("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (o.loadKind && o.loadKind !== "scalar")
      throw new T("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (o.multi)
      throw new T("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), n.forEach(function(o) {
    if (!(o instanceof E))
      throw new T("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(ze.prototype);
  return i.implicit = (this.implicit || []).concat(r), i.explicit = (this.explicit || []).concat(n), i.compiledImplicit = nt(i, "implicit"), i.compiledExplicit = nt(i, "explicit"), i.compiledTypeMap = Br(i.compiledImplicit, i.compiledExplicit), i;
};
var Vr = ze, jr = new E("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), $r = new E("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), zr = new E("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), Yr = new Vr({
  explicit: [
    jr,
    $r,
    zr
  ]
});
function qr(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function Wr() {
  return null;
}
function Gr(e) {
  return e === null;
}
var Kr = new E("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: qr,
  construct: Wr,
  predicate: Gr,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
});
function Jr(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function Qr(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function Xr(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var Zr = new E("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: Jr,
  construct: Qr,
  predicate: Xr,
  represent: {
    lowercase: function(e) {
      return e ? "true" : "false";
    },
    uppercase: function(e) {
      return e ? "TRUE" : "FALSE";
    },
    camelcase: function(e) {
      return e ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
});
function ei(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function ti(e) {
  return 48 <= e && e <= 55;
}
function ri(e) {
  return 48 <= e && e <= 57;
}
function ii(e) {
  if (e === null) return !1;
  var t = e.length, r = 0, n = !1, i;
  if (!t) return !1;
  if (i = e[r], (i === "-" || i === "+") && (i = e[++r]), i === "0") {
    if (r + 1 === t) return !0;
    if (i = e[++r], i === "b") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (i !== "0" && i !== "1") return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "x") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!ei(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "o") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!ti(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; r < t; r++)
    if (i = e[r], i !== "_") {
      if (!ri(e.charCodeAt(r)))
        return !1;
      n = !0;
    }
  return !(!n || i === "_");
}
function ni(e) {
  var t = e, r = 1, n;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), n = t[0], (n === "-" || n === "+") && (n === "-" && (r = -1), t = t.slice(1), n = t[0]), t === "0") return 0;
  if (n === "0") {
    if (t[1] === "b") return r * parseInt(t.slice(2), 2);
    if (t[1] === "x") return r * parseInt(t.slice(2), 16);
    if (t[1] === "o") return r * parseInt(t.slice(2), 8);
  }
  return r * parseInt(t, 10);
}
function oi(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !S.isNegativeZero(e);
}
var si = new E("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: ii,
  construct: ni,
  predicate: oi,
  represent: {
    binary: function(e) {
      return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
    },
    octal: function(e) {
      return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1);
    },
    decimal: function(e) {
      return e.toString(10);
    },
    /* eslint-disable max-len */
    hexadecimal: function(e) {
      return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
}), ai = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function li(e) {
  return !(e === null || !ai.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function ci(e) {
  var t, r;
  return t = e.replace(/_/g, "").toLowerCase(), r = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? r === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : r * parseFloat(t, 10);
}
var ui = /^[-+]?[0-9]+e/;
function pi(e, t) {
  var r;
  if (isNaN(e))
    switch (t) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  else if (Number.POSITIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  else if (Number.NEGATIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  else if (S.isNegativeZero(e))
    return "-0.0";
  return r = e.toString(10), ui.test(r) ? r.replace("e", ".e") : r;
}
function di(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || S.isNegativeZero(e));
}
var hi = new E("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: li,
  construct: ci,
  predicate: di,
  represent: pi,
  defaultStyle: "lowercase"
}), fi = Yr.extend({
  implicit: [
    Kr,
    Zr,
    si,
    hi
  ]
}), mi = fi, At = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), Et = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function bi(e) {
  return e === null ? !1 : At.exec(e) !== null || Et.exec(e) !== null;
}
function gi(e) {
  var t, r, n, i, o, s, a, l = 0, c = null, d, p, f;
  if (t = At.exec(e), t === null && (t = Et.exec(e)), t === null) throw new Error("Date resolve error");
  if (r = +t[1], n = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(r, n, i));
  if (o = +t[4], s = +t[5], a = +t[6], t[7]) {
    for (l = t[7].slice(0, 3); l.length < 3; )
      l += "0";
    l = +l;
  }
  return t[9] && (d = +t[10], p = +(t[11] || 0), c = (d * 60 + p) * 6e4, t[9] === "-" && (c = -c)), f = new Date(Date.UTC(r, n, i, o, s, a, l)), c && f.setTime(f.getTime() - c), f;
}
function vi(e) {
  return e.toISOString();
}
var xi = new E("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: bi,
  construct: gi,
  instanceOf: Date,
  represent: vi
});
function wi(e) {
  return e === "<<" || e === null;
}
var yi = new E("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: wi
}), Je = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function Ci(e) {
  if (e === null) return !1;
  var t, r, n = 0, i = e.length, o = Je;
  for (r = 0; r < i; r++)
    if (t = o.indexOf(e.charAt(r)), !(t > 64)) {
      if (t < 0) return !1;
      n += 6;
    }
  return n % 8 === 0;
}
function _i(e) {
  var t, r, n = e.replace(/[\r\n=]/g, ""), i = n.length, o = Je, s = 0, a = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (a.push(s >> 16 & 255), a.push(s >> 8 & 255), a.push(s & 255)), s = s << 6 | o.indexOf(n.charAt(t));
  return r = i % 4 * 6, r === 0 ? (a.push(s >> 16 & 255), a.push(s >> 8 & 255), a.push(s & 255)) : r === 18 ? (a.push(s >> 10 & 255), a.push(s >> 2 & 255)) : r === 12 && a.push(s >> 4 & 255), new Uint8Array(a);
}
function Si(e) {
  var t = "", r = 0, n, i, o = e.length, s = Je;
  for (n = 0; n < o; n++)
    n % 3 === 0 && n && (t += s[r >> 18 & 63], t += s[r >> 12 & 63], t += s[r >> 6 & 63], t += s[r & 63]), r = (r << 8) + e[n];
  return i = o % 3, i === 0 ? (t += s[r >> 18 & 63], t += s[r >> 12 & 63], t += s[r >> 6 & 63], t += s[r & 63]) : i === 2 ? (t += s[r >> 10 & 63], t += s[r >> 4 & 63], t += s[r << 2 & 63], t += s[64]) : i === 1 && (t += s[r >> 2 & 63], t += s[r << 4 & 63], t += s[64], t += s[64]), t;
}
function Ai(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var Ei = new E("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: Ci,
  construct: _i,
  predicate: Ai,
  represent: Si
}), ki = Object.prototype.hasOwnProperty, Li = Object.prototype.toString;
function Oi(e) {
  if (e === null) return !0;
  var t = [], r, n, i, o, s, a = e;
  for (r = 0, n = a.length; r < n; r += 1) {
    if (i = a[r], s = !1, Li.call(i) !== "[object Object]") return !1;
    for (o in i)
      if (ki.call(i, o))
        if (!s) s = !0;
        else return !1;
    if (!s) return !1;
    if (t.indexOf(o) === -1) t.push(o);
    else return !1;
  }
  return !0;
}
function Ti(e) {
  return e !== null ? e : [];
}
var Ri = new E("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: Oi,
  construct: Ti
}), Ni = Object.prototype.toString;
function Ii(e) {
  if (e === null) return !0;
  var t, r, n, i, o, s = e;
  for (o = new Array(s.length), t = 0, r = s.length; t < r; t += 1) {
    if (n = s[t], Ni.call(n) !== "[object Object]" || (i = Object.keys(n), i.length !== 1)) return !1;
    o[t] = [i[0], n[i[0]]];
  }
  return !0;
}
function Fi(e) {
  if (e === null) return [];
  var t, r, n, i, o, s = e;
  for (o = new Array(s.length), t = 0, r = s.length; t < r; t += 1)
    n = s[t], i = Object.keys(n), o[t] = [i[0], n[i[0]]];
  return o;
}
var Pi = new E("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: Ii,
  construct: Fi
}), Mi = Object.prototype.hasOwnProperty;
function Di(e) {
  if (e === null) return !0;
  var t, r = e;
  for (t in r)
    if (Mi.call(r, t) && r[t] !== null)
      return !1;
  return !0;
}
function Ui(e) {
  return e !== null ? e : {};
}
var Hi = new E("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: Di,
  construct: Ui
}), kt = mi.extend({
  implicit: [
    xi,
    yi
  ],
  explicit: [
    Ei,
    Ri,
    Pi,
    Hi
  ]
}), q = Object.prototype.hasOwnProperty, Ne = 1, Lt = 2, Ot = 3, Ie = 4, $e = 1, Bi = 2, ot = 3, Vi = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, ji = /[\x85\u2028\u2029]/, $i = /[,\[\]\{\}]/, Tt = /^(?:!|!!|![a-z\-]+!)$/i, Rt = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function st(e) {
  return Object.prototype.toString.call(e);
}
function U(e) {
  return e === 10 || e === 13;
}
function ne(e) {
  return e === 9 || e === 32;
}
function R(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function ae(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function zi(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function Yi(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function qi(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function at(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function Wi(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
var Nt = new Array(256), It = new Array(256);
for (var oe = 0; oe < 256; oe++)
  Nt[oe] = at(oe) ? 1 : 0, It[oe] = at(oe);
function Gi(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || kt, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function Ft(e, t) {
  var r = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return r.snippet = Pr(r), new T(t, r);
}
function m(e, t) {
  throw Ft(e, t);
}
function Fe(e, t) {
  e.onWarning && e.onWarning.call(null, Ft(e, t));
}
var lt = {
  YAML: function(t, r, n) {
    var i, o, s;
    t.version !== null && m(t, "duplication of %YAML directive"), n.length !== 1 && m(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(n[0]), i === null && m(t, "ill-formed argument of the YAML directive"), o = parseInt(i[1], 10), s = parseInt(i[2], 10), o !== 1 && m(t, "unacceptable YAML version of the document"), t.version = n[0], t.checkLineBreaks = s < 2, s !== 1 && s !== 2 && Fe(t, "unsupported YAML version of the document");
  },
  TAG: function(t, r, n) {
    var i, o;
    n.length !== 2 && m(t, "TAG directive accepts exactly two arguments"), i = n[0], o = n[1], Tt.test(i) || m(t, "ill-formed tag handle (first argument) of the TAG directive"), q.call(t.tagMap, i) && m(t, 'there is a previously declared suffix for "' + i + '" tag handle'), Rt.test(o) || m(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      o = decodeURIComponent(o);
    } catch {
      m(t, "tag prefix is malformed: " + o);
    }
    t.tagMap[i] = o;
  }
};
function Y(e, t, r, n) {
  var i, o, s, a;
  if (t < r) {
    if (a = e.input.slice(t, r), n)
      for (i = 0, o = a.length; i < o; i += 1)
        s = a.charCodeAt(i), s === 9 || 32 <= s && s <= 1114111 || m(e, "expected valid JSON character");
    else Vi.test(a) && m(e, "the stream contains non-printable characters");
    e.result += a;
  }
}
function ct(e, t, r, n) {
  var i, o, s, a;
  for (S.isObject(r) || m(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(r), s = 0, a = i.length; s < a; s += 1)
    o = i[s], q.call(t, o) || (t[o] = r[o], n[o] = !0);
}
function le(e, t, r, n, i, o, s, a, l) {
  var c, d;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), c = 0, d = i.length; c < d; c += 1)
      Array.isArray(i[c]) && m(e, "nested arrays are not supported inside keys"), typeof i == "object" && st(i[c]) === "[object Object]" && (i[c] = "[object Object]");
  if (typeof i == "object" && st(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), n === "tag:yaml.org,2002:merge")
    if (Array.isArray(o))
      for (c = 0, d = o.length; c < d; c += 1)
        ct(e, t, o[c], r);
    else
      ct(e, t, o, r);
  else
    !e.json && !q.call(r, i) && q.call(t, i) && (e.line = s || e.line, e.lineStart = a || e.lineStart, e.position = l || e.position, m(e, "duplicated mapping key")), i === "__proto__" ? Object.defineProperty(t, i, {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: o
    }) : t[i] = o, delete r[i];
  return t;
}
function Qe(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : m(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function _(e, t, r) {
  for (var n = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; ne(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (U(i))
      for (Qe(e), i = e.input.charCodeAt(e.position), n++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return r !== -1 && n !== 0 && e.lineIndent < r && Fe(e, "deficient indentation"), n;
}
function He(e) {
  var t = e.position, r;
  return r = e.input.charCodeAt(t), !!((r === 45 || r === 46) && r === e.input.charCodeAt(t + 1) && r === e.input.charCodeAt(t + 2) && (t += 3, r = e.input.charCodeAt(t), r === 0 || R(r)));
}
function Xe(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += S.repeat(`
`, t - 1));
}
function Ki(e, t, r) {
  var n, i, o, s, a, l, c, d, p = e.kind, f = e.result, h;
  if (h = e.input.charCodeAt(e.position), R(h) || ae(h) || h === 35 || h === 38 || h === 42 || h === 33 || h === 124 || h === 62 || h === 39 || h === 34 || h === 37 || h === 64 || h === 96 || (h === 63 || h === 45) && (i = e.input.charCodeAt(e.position + 1), R(i) || r && ae(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", o = s = e.position, a = !1; h !== 0; ) {
    if (h === 58) {
      if (i = e.input.charCodeAt(e.position + 1), R(i) || r && ae(i))
        break;
    } else if (h === 35) {
      if (n = e.input.charCodeAt(e.position - 1), R(n))
        break;
    } else {
      if (e.position === e.lineStart && He(e) || r && ae(h))
        break;
      if (U(h))
        if (l = e.line, c = e.lineStart, d = e.lineIndent, _(e, !1, -1), e.lineIndent >= t) {
          a = !0, h = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = s, e.line = l, e.lineStart = c, e.lineIndent = d;
          break;
        }
    }
    a && (Y(e, o, s, !1), Xe(e, e.line - l), o = s = e.position, a = !1), ne(h) || (s = e.position + 1), h = e.input.charCodeAt(++e.position);
  }
  return Y(e, o, s, !1), e.result ? !0 : (e.kind = p, e.result = f, !1);
}
function Ji(e, t) {
  var r, n, i;
  if (r = e.input.charCodeAt(e.position), r !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = i = e.position; (r = e.input.charCodeAt(e.position)) !== 0; )
    if (r === 39)
      if (Y(e, n, e.position, !0), r = e.input.charCodeAt(++e.position), r === 39)
        n = e.position, e.position++, i = e.position;
      else
        return !0;
    else U(r) ? (Y(e, n, i, !0), Xe(e, _(e, !1, t)), n = i = e.position) : e.position === e.lineStart && He(e) ? m(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  m(e, "unexpected end of the stream within a single quoted scalar");
}
function Qi(e, t) {
  var r, n, i, o, s, a;
  if (a = e.input.charCodeAt(e.position), a !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = n = e.position; (a = e.input.charCodeAt(e.position)) !== 0; ) {
    if (a === 34)
      return Y(e, r, e.position, !0), e.position++, !0;
    if (a === 92) {
      if (Y(e, r, e.position, !0), a = e.input.charCodeAt(++e.position), U(a))
        _(e, !1, t);
      else if (a < 256 && Nt[a])
        e.result += It[a], e.position++;
      else if ((s = Yi(a)) > 0) {
        for (i = s, o = 0; i > 0; i--)
          a = e.input.charCodeAt(++e.position), (s = zi(a)) >= 0 ? o = (o << 4) + s : m(e, "expected hexadecimal character");
        e.result += Wi(o), e.position++;
      } else
        m(e, "unknown escape sequence");
      r = n = e.position;
    } else U(a) ? (Y(e, r, n, !0), Xe(e, _(e, !1, t)), r = n = e.position) : e.position === e.lineStart && He(e) ? m(e, "unexpected end of the document within a double quoted scalar") : (e.position++, n = e.position);
  }
  m(e, "unexpected end of the stream within a double quoted scalar");
}
function Xi(e, t) {
  var r = !0, n, i, o, s = e.tag, a, l = e.anchor, c, d, p, f, h, g = /* @__PURE__ */ Object.create(null), v, y, O, w;
  if (w = e.input.charCodeAt(e.position), w === 91)
    d = 93, h = !1, a = [];
  else if (w === 123)
    d = 125, h = !0, a = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = a), w = e.input.charCodeAt(++e.position); w !== 0; ) {
    if (_(e, !0, t), w = e.input.charCodeAt(e.position), w === d)
      return e.position++, e.tag = s, e.anchor = l, e.kind = h ? "mapping" : "sequence", e.result = a, !0;
    r ? w === 44 && m(e, "expected the node content, but found ','") : m(e, "missed comma between flow collection entries"), y = v = O = null, p = f = !1, w === 63 && (c = e.input.charCodeAt(e.position + 1), R(c) && (p = f = !0, e.position++, _(e, !0, t))), n = e.line, i = e.lineStart, o = e.position, me(e, t, Ne, !1, !0), y = e.tag, v = e.result, _(e, !0, t), w = e.input.charCodeAt(e.position), (f || e.line === n) && w === 58 && (p = !0, w = e.input.charCodeAt(++e.position), _(e, !0, t), me(e, t, Ne, !1, !0), O = e.result), h ? le(e, a, g, y, v, O, n, i, o) : p ? a.push(le(e, null, g, y, v, O, n, i, o)) : a.push(v), _(e, !0, t), w = e.input.charCodeAt(e.position), w === 44 ? (r = !0, w = e.input.charCodeAt(++e.position)) : r = !1;
  }
  m(e, "unexpected end of the stream within a flow collection");
}
function Zi(e, t) {
  var r, n, i = $e, o = !1, s = !1, a = t, l = 0, c = !1, d, p;
  if (p = e.input.charCodeAt(e.position), p === 124)
    n = !1;
  else if (p === 62)
    n = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; p !== 0; )
    if (p = e.input.charCodeAt(++e.position), p === 43 || p === 45)
      $e === i ? i = p === 43 ? ot : Bi : m(e, "repeat of a chomping mode identifier");
    else if ((d = qi(p)) >= 0)
      d === 0 ? m(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : s ? m(e, "repeat of an indentation width identifier") : (a = t + d - 1, s = !0);
    else
      break;
  if (ne(p)) {
    do
      p = e.input.charCodeAt(++e.position);
    while (ne(p));
    if (p === 35)
      do
        p = e.input.charCodeAt(++e.position);
      while (!U(p) && p !== 0);
  }
  for (; p !== 0; ) {
    for (Qe(e), e.lineIndent = 0, p = e.input.charCodeAt(e.position); (!s || e.lineIndent < a) && p === 32; )
      e.lineIndent++, p = e.input.charCodeAt(++e.position);
    if (!s && e.lineIndent > a && (a = e.lineIndent), U(p)) {
      l++;
      continue;
    }
    if (e.lineIndent < a) {
      i === ot ? e.result += S.repeat(`
`, o ? 1 + l : l) : i === $e && o && (e.result += `
`);
      break;
    }
    for (n ? ne(p) ? (c = !0, e.result += S.repeat(`
`, o ? 1 + l : l)) : c ? (c = !1, e.result += S.repeat(`
`, l + 1)) : l === 0 ? o && (e.result += " ") : e.result += S.repeat(`
`, l) : e.result += S.repeat(`
`, o ? 1 + l : l), o = !0, s = !0, l = 0, r = e.position; !U(p) && p !== 0; )
      p = e.input.charCodeAt(++e.position);
    Y(e, r, e.position, !1);
  }
  return !0;
}
function ut(e, t) {
  var r, n = e.tag, i = e.anchor, o = [], s, a = !1, l;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), l = e.input.charCodeAt(e.position); l !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, m(e, "tab characters must not be used in indentation")), !(l !== 45 || (s = e.input.charCodeAt(e.position + 1), !R(s)))); ) {
    if (a = !0, e.position++, _(e, !0, -1) && e.lineIndent <= t) {
      o.push(null), l = e.input.charCodeAt(e.position);
      continue;
    }
    if (r = e.line, me(e, t, Ot, !1, !0), o.push(e.result), _(e, !0, -1), l = e.input.charCodeAt(e.position), (e.line === r || e.lineIndent > t) && l !== 0)
      m(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return a ? (e.tag = n, e.anchor = i, e.kind = "sequence", e.result = o, !0) : !1;
}
function en(e, t, r) {
  var n, i, o, s, a, l, c = e.tag, d = e.anchor, p = {}, f = /* @__PURE__ */ Object.create(null), h = null, g = null, v = null, y = !1, O = !1, w;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = p), w = e.input.charCodeAt(e.position); w !== 0; ) {
    if (!y && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, m(e, "tab characters must not be used in indentation")), n = e.input.charCodeAt(e.position + 1), o = e.line, (w === 63 || w === 58) && R(n))
      w === 63 ? (y && (le(e, p, f, h, g, null, s, a, l), h = g = v = null), O = !0, y = !0, i = !0) : y ? (y = !1, i = !0) : m(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, w = n;
    else {
      if (s = e.line, a = e.lineStart, l = e.position, !me(e, r, Lt, !1, !0))
        break;
      if (e.line === o) {
        for (w = e.input.charCodeAt(e.position); ne(w); )
          w = e.input.charCodeAt(++e.position);
        if (w === 58)
          w = e.input.charCodeAt(++e.position), R(w) || m(e, "a whitespace character is expected after the key-value separator within a block mapping"), y && (le(e, p, f, h, g, null, s, a, l), h = g = v = null), O = !0, y = !1, i = !1, h = e.tag, g = e.result;
        else if (O)
          m(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = c, e.anchor = d, !0;
      } else if (O)
        m(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = c, e.anchor = d, !0;
    }
    if ((e.line === o || e.lineIndent > t) && (y && (s = e.line, a = e.lineStart, l = e.position), me(e, t, Ie, !0, i) && (y ? g = e.result : v = e.result), y || (le(e, p, f, h, g, v, s, a, l), h = g = v = null), _(e, !0, -1), w = e.input.charCodeAt(e.position)), (e.line === o || e.lineIndent > t) && w !== 0)
      m(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return y && le(e, p, f, h, g, null, s, a, l), O && (e.tag = c, e.anchor = d, e.kind = "mapping", e.result = p), O;
}
function tn(e) {
  var t, r = !1, n = !1, i, o, s;
  if (s = e.input.charCodeAt(e.position), s !== 33) return !1;
  if (e.tag !== null && m(e, "duplication of a tag property"), s = e.input.charCodeAt(++e.position), s === 60 ? (r = !0, s = e.input.charCodeAt(++e.position)) : s === 33 ? (n = !0, i = "!!", s = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, r) {
    do
      s = e.input.charCodeAt(++e.position);
    while (s !== 0 && s !== 62);
    e.position < e.length ? (o = e.input.slice(t, e.position), s = e.input.charCodeAt(++e.position)) : m(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; s !== 0 && !R(s); )
      s === 33 && (n ? m(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), Tt.test(i) || m(e, "named tag handle cannot contain such characters"), n = !0, t = e.position + 1)), s = e.input.charCodeAt(++e.position);
    o = e.input.slice(t, e.position), $i.test(o) && m(e, "tag suffix cannot contain flow indicator characters");
  }
  o && !Rt.test(o) && m(e, "tag name cannot contain such characters: " + o);
  try {
    o = decodeURIComponent(o);
  } catch {
    m(e, "tag name is malformed: " + o);
  }
  return r ? e.tag = o : q.call(e.tagMap, i) ? e.tag = e.tagMap[i] + o : i === "!" ? e.tag = "!" + o : i === "!!" ? e.tag = "tag:yaml.org,2002:" + o : m(e, 'undeclared tag handle "' + i + '"'), !0;
}
function rn(e) {
  var t, r;
  if (r = e.input.charCodeAt(e.position), r !== 38) return !1;
  for (e.anchor !== null && m(e, "duplication of an anchor property"), r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !R(r) && !ae(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && m(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function nn(e) {
  var t, r, n;
  if (n = e.input.charCodeAt(e.position), n !== 42) return !1;
  for (n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !R(n) && !ae(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && m(e, "name of an alias node must contain at least one character"), r = e.input.slice(t, e.position), q.call(e.anchorMap, r) || m(e, 'unidentified alias "' + r + '"'), e.result = e.anchorMap[r], _(e, !0, -1), !0;
}
function me(e, t, r, n, i) {
  var o, s, a, l = 1, c = !1, d = !1, p, f, h, g, v, y;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, o = s = a = Ie === r || Ot === r, n && _(e, !0, -1) && (c = !0, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)), l === 1)
    for (; tn(e) || rn(e); )
      _(e, !0, -1) ? (c = !0, a = o, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)) : a = !1;
  if (a && (a = c || i), (l === 1 || Ie === r) && (Ne === r || Lt === r ? v = t : v = t + 1, y = e.position - e.lineStart, l === 1 ? a && (ut(e, y) || en(e, y, v)) || Xi(e, v) ? d = !0 : (s && Zi(e, v) || Ji(e, v) || Qi(e, v) ? d = !0 : nn(e) ? (d = !0, (e.tag !== null || e.anchor !== null) && m(e, "alias node should not have any properties")) : Ki(e, v, Ne === r) && (d = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : l === 0 && (d = a && ut(e, y))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && m(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), p = 0, f = e.implicitTypes.length; p < f; p += 1)
      if (g = e.implicitTypes[p], g.resolve(e.result)) {
        e.result = g.construct(e.result), e.tag = g.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (q.call(e.typeMap[e.kind || "fallback"], e.tag))
      g = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (g = null, h = e.typeMap.multi[e.kind || "fallback"], p = 0, f = h.length; p < f; p += 1)
        if (e.tag.slice(0, h[p].tag.length) === h[p].tag) {
          g = h[p];
          break;
        }
    g || m(e, "unknown tag !<" + e.tag + ">"), e.result !== null && g.kind !== e.kind && m(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + g.kind + '", not "' + e.kind + '"'), g.resolve(e.result, e.tag) ? (e.result = g.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : m(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || d;
}
function on(e) {
  var t = e.position, r, n, i, o = !1, s;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (s = e.input.charCodeAt(e.position)) !== 0 && (_(e, !0, -1), s = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || s !== 37)); ) {
    for (o = !0, s = e.input.charCodeAt(++e.position), r = e.position; s !== 0 && !R(s); )
      s = e.input.charCodeAt(++e.position);
    for (n = e.input.slice(r, e.position), i = [], n.length < 1 && m(e, "directive name must not be less than one character in length"); s !== 0; ) {
      for (; ne(s); )
        s = e.input.charCodeAt(++e.position);
      if (s === 35) {
        do
          s = e.input.charCodeAt(++e.position);
        while (s !== 0 && !U(s));
        break;
      }
      if (U(s)) break;
      for (r = e.position; s !== 0 && !R(s); )
        s = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(r, e.position));
    }
    s !== 0 && Qe(e), q.call(lt, n) ? lt[n](e, n, i) : Fe(e, 'unknown document directive "' + n + '"');
  }
  if (_(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, _(e, !0, -1)) : o && m(e, "directives end mark is expected"), me(e, e.lineIndent - 1, Ie, !1, !0), _(e, !0, -1), e.checkLineBreaks && ji.test(e.input.slice(t, e.position)) && Fe(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && He(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, _(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    m(e, "end of the stream or a document separator is expected");
  else
    return;
}
function Pt(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var r = new Gi(e, t), n = e.indexOf("\0");
  for (n !== -1 && (r.position = n, m(r, "null byte is not allowed in input")), r.input += "\0"; r.input.charCodeAt(r.position) === 32; )
    r.lineIndent += 1, r.position += 1;
  for (; r.position < r.length - 1; )
    on(r);
  return r.documents;
}
function sn(e, t, r) {
  t !== null && typeof t == "object" && typeof r > "u" && (r = t, t = null);
  var n = Pt(e, r);
  if (typeof t != "function")
    return n;
  for (var i = 0, o = n.length; i < o; i += 1)
    t(n[i]);
}
function an(e, t) {
  var r = Pt(e, t);
  if (r.length !== 0) {
    if (r.length === 1)
      return r[0];
    throw new T("expected a single document in the stream, but found more");
  }
}
var ln = sn, cn = an, un = {
  loadAll: ln,
  load: cn
}, Mt = Object.prototype.toString, Dt = Object.prototype.hasOwnProperty, Ze = 65279, pn = 9, ve = 10, dn = 13, hn = 32, fn = 33, mn = 34, Ye = 35, bn = 37, gn = 38, vn = 39, xn = 42, Ut = 44, wn = 45, Pe = 58, yn = 61, Cn = 62, _n = 63, Sn = 64, Ht = 91, Bt = 93, An = 96, Vt = 123, En = 124, jt = 125, k = {};
k[0] = "\\0";
k[7] = "\\a";
k[8] = "\\b";
k[9] = "\\t";
k[10] = "\\n";
k[11] = "\\v";
k[12] = "\\f";
k[13] = "\\r";
k[27] = "\\e";
k[34] = '\\"';
k[92] = "\\\\";
k[133] = "\\N";
k[160] = "\\_";
k[8232] = "\\L";
k[8233] = "\\P";
var kn = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
], Ln = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function On(e, t) {
  var r, n, i, o, s, a, l;
  if (t === null) return {};
  for (r = {}, n = Object.keys(t), i = 0, o = n.length; i < o; i += 1)
    s = n[i], a = String(t[s]), s.slice(0, 2) === "!!" && (s = "tag:yaml.org,2002:" + s.slice(2)), l = e.compiledTypeMap.fallback[s], l && Dt.call(l.styleAliases, a) && (a = l.styleAliases[a]), r[s] = a;
  return r;
}
function Tn(e) {
  var t, r, n;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    r = "x", n = 2;
  else if (e <= 65535)
    r = "u", n = 4;
  else if (e <= 4294967295)
    r = "U", n = 8;
  else
    throw new T("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + r + S.repeat("0", n - t.length) + t;
}
var Rn = 1, xe = 2;
function Nn(e) {
  this.schema = e.schema || kt, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = S.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = On(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? xe : Rn, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function pt(e, t) {
  for (var r = S.repeat(" ", t), n = 0, i = -1, o = "", s, a = e.length; n < a; )
    i = e.indexOf(`
`, n), i === -1 ? (s = e.slice(n), n = a) : (s = e.slice(n, i + 1), n = i + 1), s.length && s !== `
` && (o += r), o += s;
  return o;
}
function qe(e, t) {
  return `
` + S.repeat(" ", e.indent * t);
}
function In(e, t) {
  var r, n, i;
  for (r = 0, n = e.implicitTypes.length; r < n; r += 1)
    if (i = e.implicitTypes[r], i.resolve(t))
      return !0;
  return !1;
}
function Me(e) {
  return e === hn || e === pn;
}
function we(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== Ze || 65536 <= e && e <= 1114111;
}
function dt(e) {
  return we(e) && e !== Ze && e !== dn && e !== ve;
}
function ht(e, t, r) {
  var n = dt(e), i = n && !Me(e);
  return (
    // ns-plain-safe
    (r ? (
      // c = flow-in
      n
    ) : n && e !== Ut && e !== Ht && e !== Bt && e !== Vt && e !== jt) && e !== Ye && !(t === Pe && !i) || dt(t) && !Me(t) && e === Ye || t === Pe && i
  );
}
function Fn(e) {
  return we(e) && e !== Ze && !Me(e) && e !== wn && e !== _n && e !== Pe && e !== Ut && e !== Ht && e !== Bt && e !== Vt && e !== jt && e !== Ye && e !== gn && e !== xn && e !== fn && e !== En && e !== yn && e !== Cn && e !== vn && e !== mn && e !== bn && e !== Sn && e !== An;
}
function Pn(e) {
  return !Me(e) && e !== Pe;
}
function be(e, t) {
  var r = e.charCodeAt(t), n;
  return r >= 55296 && r <= 56319 && t + 1 < e.length && (n = e.charCodeAt(t + 1), n >= 56320 && n <= 57343) ? (r - 55296) * 1024 + n - 56320 + 65536 : r;
}
function $t(e) {
  var t = /^\n* /;
  return t.test(e);
}
var zt = 1, We = 2, Yt = 3, qt = 4, se = 5;
function Mn(e, t, r, n, i, o, s, a) {
  var l, c = 0, d = null, p = !1, f = !1, h = n !== -1, g = -1, v = Fn(be(e, 0)) && Pn(be(e, e.length - 1));
  if (t || s)
    for (l = 0; l < e.length; c >= 65536 ? l += 2 : l++) {
      if (c = be(e, l), !we(c))
        return se;
      v = v && ht(c, d, a), d = c;
    }
  else {
    for (l = 0; l < e.length; c >= 65536 ? l += 2 : l++) {
      if (c = be(e, l), c === ve)
        p = !0, h && (f = f || // Foldable line = too long, and not more-indented.
        l - g - 1 > n && e[g + 1] !== " ", g = l);
      else if (!we(c))
        return se;
      v = v && ht(c, d, a), d = c;
    }
    f = f || h && l - g - 1 > n && e[g + 1] !== " ";
  }
  return !p && !f ? v && !s && !i(e) ? zt : o === xe ? se : We : r > 9 && $t(e) ? se : s ? o === xe ? se : We : f ? qt : Yt;
}
function Dn(e, t, r, n, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === xe ? '""' : "''";
    if (!e.noCompatMode && (kn.indexOf(t) !== -1 || Ln.test(t)))
      return e.quotingType === xe ? '"' + t + '"' : "'" + t + "'";
    var o = e.indent * Math.max(1, r), s = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), a = n || e.flowLevel > -1 && r >= e.flowLevel;
    function l(c) {
      return In(e, c);
    }
    switch (Mn(
      t,
      a,
      e.indent,
      s,
      l,
      e.quotingType,
      e.forceQuotes && !n,
      i
    )) {
      case zt:
        return t;
      case We:
        return "'" + t.replace(/'/g, "''") + "'";
      case Yt:
        return "|" + ft(t, e.indent) + mt(pt(t, o));
      case qt:
        return ">" + ft(t, e.indent) + mt(pt(Un(t, s), o));
      case se:
        return '"' + Hn(t) + '"';
      default:
        throw new T("impossible error: invalid scalar style");
    }
  }();
}
function ft(e, t) {
  var r = $t(e) ? String(t) : "", n = e[e.length - 1] === `
`, i = n && (e[e.length - 2] === `
` || e === `
`), o = i ? "+" : n ? "" : "-";
  return r + o + `
`;
}
function mt(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function Un(e, t) {
  for (var r = /(\n+)([^\n]*)/g, n = function() {
    var c = e.indexOf(`
`);
    return c = c !== -1 ? c : e.length, r.lastIndex = c, bt(e.slice(0, c), t);
  }(), i = e[0] === `
` || e[0] === " ", o, s; s = r.exec(e); ) {
    var a = s[1], l = s[2];
    o = l[0] === " ", n += a + (!i && !o && l !== "" ? `
` : "") + bt(l, t), i = o;
  }
  return n;
}
function bt(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var r = / [^ ]/g, n, i = 0, o, s = 0, a = 0, l = ""; n = r.exec(e); )
    a = n.index, a - i > t && (o = s > i ? s : a, l += `
` + e.slice(i, o), i = o + 1), s = a;
  return l += `
`, e.length - i > t && s > i ? l += e.slice(i, s) + `
` + e.slice(s + 1) : l += e.slice(i), l.slice(1);
}
function Hn(e) {
  for (var t = "", r = 0, n, i = 0; i < e.length; r >= 65536 ? i += 2 : i++)
    r = be(e, i), n = k[r], !n && we(r) ? (t += e[i], r >= 65536 && (t += e[i + 1])) : t += n || Tn(r);
  return t;
}
function Bn(e, t, r) {
  var n = "", i = e.tag, o, s, a;
  for (o = 0, s = r.length; o < s; o += 1)
    a = r[o], e.replacer && (a = e.replacer.call(r, String(o), a)), (B(e, t, a, !1, !1) || typeof a > "u" && B(e, t, null, !1, !1)) && (n !== "" && (n += "," + (e.condenseFlow ? "" : " ")), n += e.dump);
  e.tag = i, e.dump = "[" + n + "]";
}
function gt(e, t, r, n) {
  var i = "", o = e.tag, s, a, l;
  for (s = 0, a = r.length; s < a; s += 1)
    l = r[s], e.replacer && (l = e.replacer.call(r, String(s), l)), (B(e, t + 1, l, !0, !0, !1, !0) || typeof l > "u" && B(e, t + 1, null, !0, !0, !1, !0)) && ((!n || i !== "") && (i += qe(e, t)), e.dump && ve === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = o, e.dump = i || "[]";
}
function Vn(e, t, r) {
  var n = "", i = e.tag, o = Object.keys(r), s, a, l, c, d;
  for (s = 0, a = o.length; s < a; s += 1)
    d = "", n !== "" && (d += ", "), e.condenseFlow && (d += '"'), l = o[s], c = r[l], e.replacer && (c = e.replacer.call(r, l, c)), B(e, t, l, !1, !1) && (e.dump.length > 1024 && (d += "? "), d += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), B(e, t, c, !1, !1) && (d += e.dump, n += d));
  e.tag = i, e.dump = "{" + n + "}";
}
function jn(e, t, r, n) {
  var i = "", o = e.tag, s = Object.keys(r), a, l, c, d, p, f;
  if (e.sortKeys === !0)
    s.sort();
  else if (typeof e.sortKeys == "function")
    s.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new T("sortKeys must be a boolean or a function");
  for (a = 0, l = s.length; a < l; a += 1)
    f = "", (!n || i !== "") && (f += qe(e, t)), c = s[a], d = r[c], e.replacer && (d = e.replacer.call(r, c, d)), B(e, t + 1, c, !0, !0, !0) && (p = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, p && (e.dump && ve === e.dump.charCodeAt(0) ? f += "?" : f += "? "), f += e.dump, p && (f += qe(e, t)), B(e, t + 1, d, !0, p) && (e.dump && ve === e.dump.charCodeAt(0) ? f += ":" : f += ": ", f += e.dump, i += f));
  e.tag = o, e.dump = i || "{}";
}
function vt(e, t, r) {
  var n, i, o, s, a, l;
  for (i = r ? e.explicitTypes : e.implicitTypes, o = 0, s = i.length; o < s; o += 1)
    if (a = i[o], (a.instanceOf || a.predicate) && (!a.instanceOf || typeof t == "object" && t instanceof a.instanceOf) && (!a.predicate || a.predicate(t))) {
      if (r ? a.multi && a.representName ? e.tag = a.representName(t) : e.tag = a.tag : e.tag = "?", a.represent) {
        if (l = e.styleMap[a.tag] || a.defaultStyle, Mt.call(a.represent) === "[object Function]")
          n = a.represent(t, l);
        else if (Dt.call(a.represent, l))
          n = a.represent[l](t, l);
        else
          throw new T("!<" + a.tag + '> tag resolver accepts not "' + l + '" style');
        e.dump = n;
      }
      return !0;
    }
  return !1;
}
function B(e, t, r, n, i, o, s) {
  e.tag = null, e.dump = r, vt(e, r, !1) || vt(e, r, !0);
  var a = Mt.call(e.dump), l = n, c;
  n && (n = e.flowLevel < 0 || e.flowLevel > t);
  var d = a === "[object Object]" || a === "[object Array]", p, f;
  if (d && (p = e.duplicates.indexOf(r), f = p !== -1), (e.tag !== null && e.tag !== "?" || f || e.indent !== 2 && t > 0) && (i = !1), f && e.usedDuplicates[p])
    e.dump = "*ref_" + p;
  else {
    if (d && f && !e.usedDuplicates[p] && (e.usedDuplicates[p] = !0), a === "[object Object]")
      n && Object.keys(e.dump).length !== 0 ? (jn(e, t, e.dump, i), f && (e.dump = "&ref_" + p + e.dump)) : (Vn(e, t, e.dump), f && (e.dump = "&ref_" + p + " " + e.dump));
    else if (a === "[object Array]")
      n && e.dump.length !== 0 ? (e.noArrayIndent && !s && t > 0 ? gt(e, t - 1, e.dump, i) : gt(e, t, e.dump, i), f && (e.dump = "&ref_" + p + e.dump)) : (Bn(e, t, e.dump), f && (e.dump = "&ref_" + p + " " + e.dump));
    else if (a === "[object String]")
      e.tag !== "?" && Dn(e, e.dump, t, o, l);
    else {
      if (a === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new T("unacceptable kind of an object to dump " + a);
    }
    e.tag !== null && e.tag !== "?" && (c = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? c = "!" + c : c.slice(0, 18) === "tag:yaml.org,2002:" ? c = "!!" + c.slice(18) : c = "!<" + c + ">", e.dump = c + " " + e.dump);
  }
  return !0;
}
function $n(e, t) {
  var r = [], n = [], i, o;
  for (Ge(e, r, n), i = 0, o = n.length; i < o; i += 1)
    t.duplicates.push(r[n[i]]);
  t.usedDuplicates = new Array(o);
}
function Ge(e, t, r) {
  var n, i, o;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      r.indexOf(i) === -1 && r.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, o = e.length; i < o; i += 1)
        Ge(e[i], t, r);
    else
      for (n = Object.keys(e), i = 0, o = n.length; i < o; i += 1)
        Ge(e[n[i]], t, r);
}
function zn(e, t) {
  t = t || {};
  var r = new Nn(t);
  r.noRefs || $n(e, r);
  var n = e;
  return r.replacer && (n = r.replacer.call({ "": n }, "", n)), B(r, 0, n, !0, !0) ? r.dump + `
` : "";
}
var Yn = zn, qn = {
  dump: Yn
}, Wt = un.load, Wn = qn.dump;
const Te = {
  BACKEND: "https://url.v1.mk",
  LOCK_BACKEND: !1,
  REMOTE_CONFIG: "",
  CHUNK_COUNT: "20"
};
function Gn(e, t = 10) {
  const r = [];
  let n = [];
  return e.forEach((i, o) => {
    n.push(i), (o + 1) % t === 0 && (r.push(n.join("|")), n = []);
  }), n.length > 0 && r.push(n.join("|")), r;
}
const Re = {
  /** 默认不启用重试 */
  retries: 0,
  /** 默认重试间隔（毫秒） */
  retryDelay: 1e3,
  /** 默认需要重试的状态码 */
  retryOnStatusCodes: [500, 502, 503, 504]
};
async function et(e, t = Re) {
  const {
    retries: r = Re.retries,
    retryDelay: n = Re.retryDelay,
    retryOnStatusCodes: i = Re.retryOnStatusCodes,
    onError: o,
    ...s
  } = t;
  let a = 0;
  const l = async () => {
    a++;
    try {
      let c, d;
      e instanceof Request ? (d = e.url, c = new Request(e, s)) : (d = e.toString(), c = new Request(d, s));
      const p = await fetch(c), f = {
        status: p.status,
        statusText: p.statusText,
        headers: Object.fromEntries(p.headers.entries()),
        data: p,
        config: { url: d, ...s },
        ok: p.ok
      };
      if (i.includes(f.status) && a <= r) {
        if (o) {
          const h = o(new Error(`请求失败，状态码 ${f.status}`), a);
          h instanceof Promise && await h;
        }
        return await new Promise((h) => setTimeout(h, n)), l();
      }
      return f;
    } catch (c) {
      if (o) {
        const d = o(c, a);
        d instanceof Promise && await d;
      }
      if (a <= r)
        return await new Promise((d) => setTimeout(d, n)), l();
      throw c;
    }
  };
  return l();
}
function Ke(e) {
  if (!e) return e;
  const t = atob(e), r = new Uint8Array(t.length);
  for (let n = 0; n < t.length; n++)
    r[n] = t.charCodeAt(n);
  return new TextDecoder().decode(r);
}
function xt(e) {
  if (!e) return e;
  const t = new TextEncoder().encode(e.trim());
  let r = "";
  for (let n = 0; n < t.length; n += 1)
    r += String.fromCharCode(t[n]);
  return btoa(r);
}
class Kn {
  constructor(t = []) {
    A(this, "existVps", []);
    A(this, "existVpsMap", /* @__PURE__ */ new Map());
    this.existVps = t, this.updateExist(this.existVps);
  }
  updateExist(t = []) {
    for (const r of t) {
      const n = this.getParser(r);
      n && this.setExistVpsMap(n);
    }
  }
  updateVpsPs(t) {
    const r = this.getParser(t);
    if (!r) return null;
    const n = r.originPs, [i, o] = n.split("#");
    if (!o) return t;
    const s = this.existVpsMap.get(o) || 0, a = s === 0 ? n : `${i}#${o} ${s}`;
    return r.updateOriginConfig(a), this.existVpsMap.set(o, s + 1), r.originLink;
  }
  setExistVpsMap(t) {
    const r = t.originPs, [, n] = r.split("#");
    if (!n) return;
    const [i, o] = n.split(" "), s = o ? Number.parseInt(o) >>> 0 : 0, a = this.existVpsMap.get(i) || 0;
    this.existVpsMap.set(i, Math.max(a, s + 1));
  }
  getParser(t) {
    return t.startsWith("vless://") ? new Qt(t) : t.startsWith("vmess://") ? new Xt(t) : t.startsWith("trojan://") ? new Jt(t) : t.startsWith("ss://") ? new Kt(t) : t.startsWith("hysteria2://") || t.startsWith("hysteria://") || t.startsWith("hy2://") ? new Gt(t) : null;
  }
}
class Jn extends Kn {
  constructor(t = []) {
    super(t);
  }
}
var ye, Ce, _e, De;
class Oe {
  constructor() {
    x(this, ye, ["localhost", "127.0.0.1", "abc.cba.com"]);
    x(this, Ce, ["AES_256_GCM", "CHACHA20_POLY1305", "AES_128_GCM", "CHACHA20_IETF"]);
    x(this, _e, 1024);
    x(this, De, 65535);
  }
  /**
   * @description 获取随机uuid
   * @returns {crypto.UUID} crypto.UUID
   */
  getUUID() {
    return crypto.randomUUID();
  }
  /**
   * @description 获取随机username
   * @returns {string} username
   */
  getUsername() {
    return this.getUUID();
  }
  /**
   * @description 获取随机password
   * @returns {string} crypto.UUID
   */
  getPassword() {
    return this.getUUID();
  }
  getHost() {
    return `${this.getHostName()}:${this.getPort()}`;
  }
  /**
   * @description 获取随机hostname
   * @returns {string} hostname
   */
  getHostName() {
    return u(this, ye)[Math.floor(Math.random() * u(this, ye).length)];
  }
  /**
   * @description 获取随机端口
   * @returns {string} port
   */
  getPort() {
    return Math.floor(Math.random() * (u(this, De) - u(this, _e) + 1) + u(this, _e)).toString();
  }
  /**
   * @description 获取随机 SS协议的加密类型
   */
  getEncrtptionProtocol() {
    return u(this, Ce)[Math.floor(Math.random() * u(this, Ce).length)];
  }
}
ye = new WeakMap(), Ce = new WeakMap(), _e = new WeakMap(), De = new WeakMap();
var W, G;
const N = class N {
  /**
   * @description 获取备注
   * @param {string} name
   * @returns {[string, string]} [origin, confuse]
   */
  static getPs(t) {
    const r = t.split(u(N, W));
    return [r[0], r[1]];
  }
  /**
   * @description 设置备注
   * @param {string} name 原始备注
   * @param {string} ps 混淆备注
   * @returns {string} origin^LINK_TO^confuse
   */
  static setPs(t, r) {
    return [t, r].join(u(N, W));
  }
  /**
   * @description 获取前缀（带缓存）
   * @param {string} name
   * @returns {string|null} prefix
   */
  static getPrefix(t) {
    if (!(t != null && t.includes(u(N, W)))) return null;
    if (u(N, G).has(t))
      return u(N, G).get(t);
    const [r] = N.getPs(t);
    if (r) {
      const n = r.trim();
      return u(N, G).set(t, n), n;
    }
    return null;
  }
  static isConfigType(t) {
    return t.includes(u(this, W));
  }
  // 清除缓存
  static clearCache() {
    u(this, G).clear();
  }
};
W = new WeakMap(), G = new WeakMap(), x(N, W, "^LINK_TO^"), x(N, G, /* @__PURE__ */ new Map());
let L = N;
var K, Se, V, I, J, ce;
class Gt extends Oe {
  constructor(r) {
    super();
    /** * @description 原始链接 */
    x(this, K, "");
    /** * @description 混淆链接 */
    x(this, Se, "");
    /** * @description vps原始配置 */
    x(this, V, {});
    /** * @description 混淆配置 */
    x(this, I, {});
    /** * @description 原始备注 */
    x(this, J, "");
    /** * @description 混淆备注 */
    x(this, ce, "");
    b(this, ce, crypto.randomUUID()), this.setOriginConfig(r), this.setConfuseConfig(r);
  }
  /**
   * @description 设置原始配置
   * @param {string} v
   */
  setOriginConfig(r) {
    b(this, K, r), b(this, V, new URL(r)), b(this, J, u(this, V).hash ?? "");
  }
  /**
   * @description 更新原始配置
   * @param {string} ps
   */
  updateOriginConfig(r) {
    u(this, V).hash = r, b(this, J, r), b(this, K, u(this, V).href), this.setConfuseConfig(u(this, K));
  }
  /**
   * @description 设置混淆配置
   * @param {string} v
   */
  setConfuseConfig(r) {
    b(this, I, new URL(r)), u(this, I).username = this.getUsername(), u(this, I).host = this.getHost(), u(this, I).hostname = this.getHostName(), u(this, I).port = this.getPort(), u(this, I).hash = L.setPs(u(this, J), u(this, ce)), b(this, Se, u(this, I).href);
  }
  restoreClash(r, n) {
    var i;
    return r.name = n, r.server = this.originConfig.hostname ?? "", r.port = Number(this.originConfig.port ?? 0), r.password = ((i = this.originConfig) == null ? void 0 : i.username) ?? "", r;
  }
  restoreSingbox(r, n) {
    var i;
    return r.password = ((i = this.originConfig) == null ? void 0 : i.username) ?? "", r.server = this.originConfig.hostname ?? "", r.server_port = Number(this.originConfig.port ?? 0), r.tag = n, r;
  }
  /**
   * @description 原始备注
   * @example '#originPs'
   */
  get originPs() {
    return u(this, J);
  }
  /**
   * @description 原始链接
   * @example 'trojan://...'
   */
  get originLink() {
    return u(this, K);
  }
  /**
   * @description 原始配置
   */
  get originConfig() {
    return u(this, V);
  }
  /**
   * @description 混淆备注
   * @example 'confusePs'
   */
  get confusePs() {
    return encodeURIComponent(u(this, ce));
  }
  /**
   * @description 混淆链接
   * @example 'trojan://...'
   */
  get confuseLink() {
    return u(this, Se);
  }
  /**
   * @description 混淆配置
   */
  get confuseConfig() {
    return u(this, I);
  }
}
K = new WeakMap(), Se = new WeakMap(), V = new WeakMap(), I = new WeakMap(), J = new WeakMap(), ce = new WeakMap();
var Q, Ae, j, F, X, ue;
class Kt extends Oe {
  constructor(r) {
    super();
    /** * @description 原始链接 */
    x(this, Q, "");
    /** * @description 混淆链接 */
    x(this, Ae, "");
    /** * @description vps原始配置 */
    x(this, j, {});
    /** * @description 混淆配置 */
    x(this, F, {});
    /** * @description 原始备注 */
    x(this, X, "");
    /** * @description 混淆备注 */
    x(this, ue, "");
    b(this, ue, crypto.randomUUID()), this.setOriginConfig(r), this.setConfuseConfig(r);
  }
  /**
   * @description 设置原始配置
   * @param {string} v
   */
  setOriginConfig(r) {
    b(this, Q, r), b(this, j, new URL(r)), b(this, X, u(this, j).hash ?? "");
  }
  /**
   * @description 更新原始配置
   * @param {string} ps
   */
  updateOriginConfig(r) {
    u(this, j).hash = r, b(this, X, r), b(this, Q, u(this, j).href), this.setConfuseConfig(u(this, Q));
  }
  /**
   * @description 设置混淆配置
   * @param {string} v
   */
  setConfuseConfig(r) {
    b(this, F, new URL(r)), u(this, F).username = this.getUsername(), u(this, F).host = this.getHost(), u(this, F).hostname = this.getHostName(), u(this, F).port = this.getPort(), u(this, F).hash = L.setPs(u(this, X), u(this, ue)), b(this, Ae, u(this, F).href);
  }
  restoreClash(r, n) {
    var i;
    return r.name = n, r.server = this.originConfig.hostname ?? "", r.port = Number(((i = this.originConfig) == null ? void 0 : i.port) ?? 0), r;
  }
  restoreSingbox(r, n) {
    return r.server = this.originConfig.hostname ?? "", r.server_port = Number(this.originConfig.port ?? 0), r.tag = n, r;
  }
  /**
   * @description 原始备注
   * @example '#originPs'
   */
  get originPs() {
    return u(this, X);
  }
  /**
   * @description 原始链接
   * @example 'ss://...'
   */
  get originLink() {
    return u(this, Q);
  }
  /**
   * @description 原始配置
   */
  get originConfig() {
    return u(this, j);
  }
  /**
   * @description 混淆备注
   * @example 'confusePs'
   */
  get confusePs() {
    return u(this, ue);
  }
  /**
   * @description 混淆链接
   * @example 'ss://...'
   */
  get confuseLink() {
    return u(this, Ae);
  }
  /**
   * @description 混淆配置
   */
  get confuseConfig() {
    return u(this, F);
  }
}
Q = new WeakMap(), Ae = new WeakMap(), j = new WeakMap(), F = new WeakMap(), X = new WeakMap(), ue = new WeakMap();
var Z, Ee, $, P, ee, pe;
class Jt extends Oe {
  constructor(r) {
    super();
    /** * @description 原始链接 */
    x(this, Z, "");
    /** * @description 混淆链接 */
    x(this, Ee, "");
    /** * @description vps原始配置 */
    x(this, $, {});
    /** * @description 混淆配置 */
    x(this, P, {});
    /** * @description 原始备注 */
    x(this, ee, "");
    /** * @description 混淆备注 */
    x(this, pe, "");
    b(this, pe, crypto.randomUUID()), this.setOriginConfig(r), this.setConfuseConfig(r);
  }
  /**
   * @description 设置原始配置
   * @param {string} v
   */
  setOriginConfig(r) {
    b(this, Z, r), b(this, $, new URL(r)), b(this, ee, u(this, $).hash ?? "");
  }
  /**
   * @description 更新原始配置
   * @param {string} ps
   */
  updateOriginConfig(r) {
    u(this, $).hash = r, b(this, ee, r), b(this, Z, u(this, $).href), this.setConfuseConfig(u(this, Z));
  }
  /**
   * @description 设置混淆配置
   * @param {string} v
   */
  setConfuseConfig(r) {
    b(this, P, new URL(r)), u(this, P).username = this.getUsername(), u(this, P).host = this.getHost(), u(this, P).hostname = this.getHostName(), u(this, P).port = this.getPort(), u(this, P).hash = L.setPs(u(this, ee), u(this, pe)), b(this, Ee, u(this, P).href);
  }
  restoreClash(r, n) {
    var i;
    return r.name = n, r.server = this.originConfig.hostname ?? "", r.port = Number(this.originConfig.port ?? 0), r.password = ((i = this.originConfig) == null ? void 0 : i.username) ?? "", r;
  }
  restoreSingbox(r, n) {
    var i;
    return r.password = ((i = this.originConfig) == null ? void 0 : i.username) ?? "", r.server = this.originConfig.hostname ?? "", r.server_port = Number(this.originConfig.port ?? 0), r.tag = n, r;
  }
  /**
   * @description 原始备注
   * @example '#originPs'
   */
  get originPs() {
    return u(this, ee);
  }
  /**
   * @description 原始链接
   * @example 'trojan://...'
   */
  get originLink() {
    return u(this, Z);
  }
  /**
   * @description 原始配置
   */
  get originConfig() {
    return u(this, $);
  }
  /**
   * @description 混淆备注
   * @example 'confusePs'
   */
  get confusePs() {
    return encodeURIComponent(u(this, pe));
  }
  /**
   * @description 混淆链接
   * @example 'trojan://...'
   */
  get confuseLink() {
    return u(this, Ee);
  }
  /**
   * @description 混淆配置
   */
  get confuseConfig() {
    return u(this, P);
  }
}
Z = new WeakMap(), Ee = new WeakMap(), $ = new WeakMap(), P = new WeakMap(), ee = new WeakMap(), pe = new WeakMap();
var te, ke, z, M, re, de;
class Qt extends Oe {
  constructor(r) {
    super();
    /** * @description 原始链接 */
    x(this, te, "");
    /** * @description 混淆链接 */
    x(this, ke, "");
    /** * @description vps原始配置 */
    x(this, z, {});
    /** * @description 混淆配置 */
    x(this, M, {});
    /** * @description 原始备注 */
    x(this, re, "");
    /** * @description 混淆备注 */
    x(this, de, "");
    b(this, de, crypto.randomUUID()), this.setOriginConfig(r), this.setConfuseConfig(r);
  }
  /**
   * @description 设置原始配置
   * @param {string} v
   */
  setOriginConfig(r) {
    b(this, te, r), b(this, z, new URL(r)), b(this, re, u(this, z).hash ?? "");
  }
  /**
   * @description 更新原始配置
   * @param {string} ps
   */
  updateOriginConfig(r) {
    u(this, z).hash = r, b(this, re, r), b(this, te, u(this, z).href), this.setConfuseConfig(u(this, te));
  }
  /**
   * @description 设置混淆配置
   * @param {string} v
   */
  setConfuseConfig(r) {
    b(this, M, new URL(r)), u(this, M).username = this.getUsername(), u(this, M).host = this.getHost(), u(this, M).hostname = this.getHostName(), u(this, M).port = this.getPort(), u(this, M).hash = L.setPs(u(this, re), u(this, de)), b(this, ke, u(this, M).href);
  }
  restoreClash(r, n) {
    var i;
    return r.name = n, r.server = this.originConfig.hostname ?? "", r.port = Number(((i = this.originConfig) == null ? void 0 : i.port) ?? 0), r.uuid = this.originConfig.username ?? "", r;
  }
  restoreSingbox(r, n) {
    var i;
    return r.tag = n, r.server = this.originConfig.hostname ?? "", r.server_port = Number(this.originConfig.port ?? 0), r.uuid = this.originConfig.username ?? "", (i = r.tls) != null && i.server_name && (r.tls.server_name = this.originConfig.hostname ?? ""), r;
  }
  /**
   * @description 原始备注
   * @example '#originPs'
   */
  get originPs() {
    return u(this, re);
  }
  /**
   * @description 原始链接
   * @example 'vless://...'
   */
  get originLink() {
    return u(this, te);
  }
  /**
   * @description 原始配置
   */
  get originConfig() {
    return u(this, z);
  }
  /**
   * @description 混淆备注
   * @example 'confusePs'
   */
  get confusePs() {
    return u(this, de);
  }
  /**
   * @description 混淆链接
   * @example 'vless://...'
   */
  get confuseLink() {
    return u(this, ke);
  }
  /**
   * @description 混淆配置
   */
  get confuseConfig() {
    return u(this, M);
  }
}
te = new WeakMap(), ke = new WeakMap(), z = new WeakMap(), M = new WeakMap(), re = new WeakMap(), de = new WeakMap();
var he, Le, H, D, ie, fe, Ue, Zt;
class Xt extends Oe {
  constructor(r) {
    super();
    x(this, Ue);
    /** * @description 原始链接 */
    x(this, he, "");
    /** * @description 混淆链接 */
    x(this, Le, "");
    /** * @description vps原始配置 */
    x(this, H, {});
    /** * @description 混淆配置 */
    x(this, D, {});
    /** * @description 原始备注 */
    x(this, ie, "");
    /** * @description 混淆备注 */
    x(this, fe, "");
    b(this, fe, crypto.randomUUID()), this.setOriginConfig(r), this.setConfuseConfig();
  }
  /**
   * @description 设置原始配置
   * @param {string} v
   */
  setOriginConfig(r) {
    const [n, i] = r.match(/vmess:\/\/(.*)/) || [];
    b(this, he, r), b(this, H, JSON.parse(Ke(i))), b(this, ie, u(this, H).ps ?? "");
  }
  /**
   * @description 更新原始配置
   * @param {string} ps
   */
  updateOriginConfig(r) {
    u(this, H).ps = r, b(this, ie, r), b(this, he, `vmess://${xt(JSON.stringify(u(this, H)))}`), this.setConfuseConfig();
  }
  /**
   * @description 设置混淆配置
   */
  setConfuseConfig() {
    b(this, D, structuredClone(u(this, H))), u(this, D).add = this.getHostName(), u(this, D).port = this.getPort(), u(this, D).id = this.getPassword(), u(this, D).ps = L.setPs(u(this, ie), u(this, fe)), b(this, Le, `vmess://${xt(JSON.stringify(u(this, D)))}`);
  }
  restoreClash(r, n) {
    var i, o;
    return rt(this, Ue, Zt).call(this, r), r.name = n, r.server = this.originConfig.add ?? "", r.port = Number(((i = this.originConfig) == null ? void 0 : i.port) ?? 0), r.uuid = ((o = this.originConfig) == null ? void 0 : o.id) ?? "", r;
  }
  restoreSingbox(r, n) {
    var i, o;
    return r.server = this.originConfig.add ?? "", r.server_port = Number(this.originConfig.port ?? 0), r.tag = n, (i = r.tls) != null && i.server_name && (r.tls.server_name = this.originConfig.add ?? ""), r.uuid = ((o = this.originConfig) == null ? void 0 : o.id) ?? "", r;
  }
  /**
   * @description 原始备注
   * @example '#originPs'
   */
  get originPs() {
    return u(this, ie);
  }
  /**
   * @description 原始链接
   * @example 'vmess://...'
   */
  get originLink() {
    return u(this, he);
  }
  /**
   * @description 原始配置
   */
  get originConfig() {
    return u(this, H);
  }
  /**
   * @description 混淆备注
   * @example 'confusePs'
   */
  get confusePs() {
    return u(this, fe);
  }
  /**
   * @description 混淆链接
   * @example 'vmess://...'
   */
  get confuseLink() {
    return u(this, Le);
  }
  /**
   * @description 混淆配置
   */
  get confuseConfig() {
    return u(this, D);
  }
}
he = new WeakMap(), Le = new WeakMap(), H = new WeakMap(), D = new WeakMap(), ie = new WeakMap(), fe = new WeakMap(), Ue = new WeakSet(), Zt = function(r) {
  r.network === "ws" && (r["ws-opts"] = {
    ...r["ws-opts"],
    path: this.originConfig.path,
    headers: {
      ...r["ws-opts"].headers,
      Host: this.originConfig.host
    }
  });
};
class Qn extends Jn {
  constructor(r, n = [], i = "") {
    super(n);
    A(this, "urlSet", /* @__PURE__ */ new Set());
    A(this, "vpsStore", /* @__PURE__ */ new Map());
    A(this, "originUrls", /* @__PURE__ */ new Set());
    A(this, "vps", []);
    A(this, "includeProtocol", []);
    this.vps = r, this.includeProtocol = i ? JSON.parse(i) : [];
  }
  async parse(r = this.vps) {
    for await (const n of r) {
      const i = this.updateVpsPs(n);
      if (i) {
        let o = null;
        i.startsWith("vless://") && this.hasProtocol("vless") ? o = new Qt(i) : i.startsWith("vmess://") && this.hasProtocol("vmess") ? o = new Xt(i) : i.startsWith("trojan://") && this.hasProtocol("trojan") ? o = new Jt(i) : i.startsWith("ss://") && this.hasProtocol("shadowsocks", "shadowsocksr") ? o = new Kt(i) : this.isHysteria2(i) && this.hasProtocol("hysteria", "hysteria2", "hy2") && (o = new Gt(i)), o && this.setStore(i, o);
      }
      if (n.startsWith("https://") || n.startsWith("http://")) {
        const o = await et(n, { retries: 3 }).then((a) => a.data.text());
        if (this.getSubType(o) === "base64" && o) {
          this.updateExist(Array.from(this.originUrls));
          const a = Ke(o);
          await this.parse(a.split(`
`).filter(Boolean));
        }
      }
    }
  }
  setStore(r, n) {
    this.urlSet.add(n.confuseLink), this.originUrls.add(r), this.vpsStore.set(n.confusePs, n);
  }
  getSubType(r) {
    try {
      return Ke(r), "base64";
    } catch {
      try {
        return Wt(r), "yaml";
      } catch {
        try {
          return JSON.parse(r), "json";
        } catch {
          return "unknown";
        }
      }
    }
  }
  isHysteria2(r) {
    return r.startsWith("hysteria2://") || r.startsWith("hysteria://") || r.startsWith("hy2://");
  }
  hasProtocol(...r) {
    return r.some((n) => this.includeProtocol.includes(n));
  }
  get urls() {
    return Array.from(this.urlSet);
  }
  get vpsMap() {
    return this.vpsStore;
  }
}
let Xn = class {
  async getConfig(t) {
    try {
      const n = (await Promise.all(t.map((i) => et(i, { retries: 3 }).then((o) => o.data.text())))).map((i) => Wt(i));
      return this.mergeClashConfig(n);
    } catch (r) {
      throw new Error(`Failed to get clash config: ${r.message || r}`);
    }
  }
  /**
   * @description 合并配置
   * @param {ClashType[]} configs
   * @returns {ClashType} mergedConfig
   */
  mergeClashConfig(t = []) {
    var r, n, i, o;
    try {
      if (!t.length)
        return {};
      const s = structuredClone(t[0]);
      if (t.length === 1)
        return s;
      const a = {
        ...s,
        proxies: s.proxies || [],
        "proxy-groups": s["proxy-groups"] || []
      }, l = t.reduce((h, g) => {
        var v;
        return h + (((v = g.proxies) == null ? void 0 : v.length) || 0);
      }, 0), c = new Int32Array(l), d = new Set((r = s.proxies) == null ? void 0 : r.map((h) => h.name));
      let p = ((n = s.proxies) == null ? void 0 : n.length) || 0;
      const f = new Map(a["proxy-groups"].map((h) => [h.name, h]));
      for (let h = 1; h < t.length; h++) {
        const g = t[h];
        if ((i = g.proxies) != null && i.length)
          for (const v of g.proxies)
            d.has(v.name) || (a.proxies[p] = v, c[p] = p, d.add(v.name), p++);
        if ((o = g["proxy-groups"]) != null && o.length)
          for (const v of g["proxy-groups"]) {
            const y = f.get(v.name);
            if (y) {
              const O = new Set(y.proxies);
              for (const w of v.proxies || [])
                O.add(w);
              y.proxies = Array.from(O), Object.assign(y, {
                ...v,
                proxies: y.proxies
              });
            } else
              a["proxy-groups"].push(v), f.set(v.name, v);
          }
      }
      return a.proxies = a.proxies.filter((h, g) => c[g] !== -1), a;
    } catch (s) {
      throw new Error(`Failed to merge clash config: ${s.message || s}`);
    }
  }
}, Zn = class {
  async getConfig(t) {
    try {
      const r = await Promise.all(
        t.map((n) => et(n, { retries: 3 }).then((i) => i.data.json()))
      );
      return this.mergeConfig(r);
    } catch (r) {
      throw new Error(`Failed to get singbox config: ${r.message || r}`);
    }
  }
  mergeConfig(t) {
    var r, n;
    try {
      if (t.length === 0)
        return {};
      const i = structuredClone(t[0]), o = [], s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map();
      for (const l of t)
        if ((r = l.outbounds) != null && r.length) {
          for (const c of l.outbounds)
            if (c.outbounds) {
              const d = `${c.type}:${c.tag}`;
              if (!a.has(d)) {
                const p = new Set(c.outbounds.filter((f) => !L.isConfigType(f)));
                a.set(d, {
                  base: c,
                  baseOutbounds: p,
                  linkOutbounds: /* @__PURE__ */ new Set()
                });
              }
              c.outbounds.forEach((p) => {
                var f;
                L.isConfigType(p) && ((f = a.get(d)) == null || f.linkOutbounds.add(p));
              });
            }
        }
      for (const l of t)
        if ((n = l.outbounds) != null && n.length) {
          for (const c of l.outbounds)
            if (!c.outbounds)
              if (L.isConfigType(c.tag))
                o.push(c);
              else {
                const d = `${c.type}:${c.tag}`;
                s.has(d) || (s.add(d), o.push(c));
              }
        }
      for (const [l, c] of a) {
        const d = { ...c.base }, p = /* @__PURE__ */ new Set([...c.baseOutbounds, ...c.linkOutbounds]);
        d.outbounds = Array.from(p), o.push(d);
      }
      return i.outbounds = o, i;
    } catch (i) {
      throw new Error(`Failed to merge singbox config: ${i.message || i}`);
    }
  }
};
class eo {
  constructor(t) {
    A(this, "urls", []);
    A(this, "chunkCount", Number(Te.CHUNK_COUNT));
    A(this, "backend", Te.BACKEND);
    A(this, "parser", null);
    A(this, "clashClient", new Xn());
    A(this, "singboxClient", new Zn());
    this.chunkCount = Number(t.CHUNK_COUNT ?? Te.CHUNK_COUNT), this.backend = t.BACKEND ?? Te.BACKEND, this.parser = null;
  }
  async setSubUrls(t) {
    const { searchParams: r } = new URL(t.url), n = r.get("url"), i = r.get("protocol"), o = n.split(/\||\n/).filter(Boolean);
    this.parser = new Qn(o, [], i), await this.parser.parse(o);
    const s = Gn(Array.from(this.parser.urls), Number(this.chunkCount));
    this.urls = s.map((a) => {
      const l = new URL(`${this.backend}/sub`), { searchParams: c } = new URL(t.url);
      return c.set("url", a), l.search = c.toString(), l.toString();
    });
  }
  async getClashConfig() {
    return await this.clashClient.getConfig(this.urls);
  }
  async getSingboxConfig() {
    return await this.singboxClient.getConfig(this.urls);
  }
  get vpsStore() {
    var t;
    return (t = this.parser) == null ? void 0 : t.vpsMap;
  }
}
class to {
  constructor(t) {
    A(this, "confuseConfig");
    this.confuseConfig = t;
  }
  getOriginConfig(t) {
    var r, n;
    try {
      return this.confuseConfig.proxies = this.restoreProxies(this.confuseConfig.proxies, t), this.confuseConfig["proxy-groups"] = (n = (r = this.confuseConfig) == null ? void 0 : r["proxy-groups"]) == null ? void 0 : n.map((i) => (i.proxies && (i.proxies = this.updateProxiesGroups(i.proxies)), i)), this.confuseConfig;
    } catch (i) {
      throw new Error(`Get origin config failed: ${i.message || i}, function trace: ${i.stack}`);
    }
  }
  restoreProxies(t, r) {
    try {
      if (!t)
        return [];
      const n = [];
      for (const i of t) {
        const [o, s] = L.getPs(i.name);
        if (r.has(s)) {
          const a = r.get(s);
          a == null || a.restoreClash(i, o), n.push(i);
        }
      }
      return n;
    } catch (n) {
      throw new Error(`Restore proxies failed: ${n.message || n}, function trace: ${n.stack}`);
    }
  }
  updateProxiesGroups(t) {
    try {
      return t.map((r) => {
        const [n] = L.getPs(r);
        return n;
      });
    } catch (r) {
      throw new Error(`Update proxies groups failed: ${r.message || r}, function trace: ${r.stack}`);
    }
  }
}
class ro {
  constructor(t) {
    A(this, "confuseConfig");
    this.confuseConfig = t;
  }
  getOriginConfig(t) {
    try {
      return this.confuseConfig.outbounds = this.restoreOutbounds(this.confuseConfig.outbounds, t), this.confuseConfig;
    } catch (r) {
      throw new Error(`Get origin config failed: ${r.message || r}, function trace: ${r.stack}`);
    }
  }
  restoreOutbounds(t = [], r) {
    try {
      const n = [];
      for (const i of t) {
        if (this.isConfuseVps(i.tag)) {
          const [o, s] = L.getPs(i.tag), a = r.get(s);
          a == null || a.restoreSingbox(i, o);
        }
        Reflect.has(i, "outbounds") && (i.outbounds = this.updateOutbouns(i.outbounds)), n.push(i);
      }
      return n;
    } catch (n) {
      throw new Error(`Restore outbounds failed: ${n.message || n}, function trace: ${n.stack}`);
    }
  }
  updateOutbouns(t = []) {
    try {
      return t.map((r) => {
        if (this.isConfuseVps(r)) {
          const [n] = L.getPs(r);
          return n;
        }
        return r;
      });
    } catch (r) {
      throw new Error(`Update outbounds failed: ${r.message || r}, function trace: ${r.stack}`);
    }
  }
  isConfuseVps(t) {
    return L.isConfigType(t);
  }
}
class io {
  constructor(t) {
    this.confuse = t, this.confuse = t;
  }
  async getClashConfig() {
    const t = await this.confuse.getClashConfig();
    return new to(t).getOriginConfig(this.confuse.vpsStore);
  }
  async getSingboxConfig() {
    const t = await this.confuse.getSingboxConfig();
    return new ro(t).getOriginConfig(this.confuse.vpsStore);
  }
}
class no {
  constructor(t) {
    this.db = t;
  }
  async toSub(t, r, n) {
    try {
      const i = new eo(r);
      await i.setSubUrls(t);
      const o = new io(i);
      if (["clash", "clashr"].includes(n)) {
        const s = await o.getClashConfig();
        return new Response(Wn(s, { indent: 2, lineWidth: 200 }), {
          headers: new Headers({
            "Content-Type": "text/yaml; charset=UTF-8",
            "Cache-Control": "no-store"
          })
        });
      }
      if (n === "singbox") {
        const s = await o.getSingboxConfig();
        return new Response(JSON.stringify(s), {
          headers: new Headers({
            "Content-Type": "text/plain; charset=UTF-8",
            "Cache-Control": "no-store"
          })
        });
      }
      return C.error("Unsupported client type, support list: clash, clashr");
    } catch (i) {
      throw new Error(i.message || "Invalid request");
    }
  }
  async add(t, r) {
    if (!this.db)
      throw new Error("Database is not initialized");
    const n = this.generateShortCode(), i = `${r}/${n}`, o = await this.db.prepare("INSERT INTO short_url (short_code, short_url, long_url) VALUES (?, ?, ?) RETURNING id").bind(n, i, t).first();
    if (!(o != null && o.id))
      throw new Error("Failed to create short URL");
    return { id: o.id, short_code: n, short_url: i, long_url: t };
  }
  async delete(t) {
    if (!this.db)
      throw new Error("Database is not initialized");
    await this.db.prepare("DELETE FROM short_url WHERE id = ?").bind(t).run();
  }
  async getById(t) {
    if (!this.db)
      throw new Error("Database is not initialized");
    return await this.db.prepare("SELECT id, short_url, long_url FROM short_url WHERE id = ?").bind(t).first();
  }
  async getList(t = 1, r = 10) {
    if (!this.db)
      throw new Error("Database is not initialized");
    const n = (t - 1) * r, [i, o] = await Promise.all([
      this.db.prepare("SELECT COUNT(*) as count FROM short_url").first(),
      this.db.prepare("SELECT id, short_code, short_url, long_url FROM short_url LIMIT ? OFFSET ?").bind(r, n).all()
    ]);
    return {
      total: (i == null ? void 0 : i.count) || 0,
      items: (o == null ? void 0 : o.results) || []
    };
  }
  async getByShortUrl(t) {
    if (!this.db)
      throw new Error("Database is not initialized");
    return await this.db.prepare("SELECT id, short_code, short_url, long_url FROM short_url WHERE short_url = ?").bind(t).first();
  }
  async getByCode(t) {
    if (!this.db)
      throw new Error("Database is not initialized");
    return await this.db.prepare("SELECT id, short_code, short_url, long_url FROM short_url WHERE short_code = ?").bind(t).first();
  }
  async deleteByCode(t) {
    if (!this.db)
      throw new Error("Database is not initialized");
    await this.db.prepare("DELETE FROM short_url WHERE short_code = ?").bind(t).run();
  }
  generateShortCode() {
    return crypto.randomUUID().substring(0, 8);
  }
}
const wt = new ir(), lo = {
  async fetch(e, t) {
    try {
      if (e.method === "OPTIONS")
        return C.cors(new Response(null, { status: 200 }));
      const r = new no(t.DB), n = new rr(r);
      wt.get("/", (o) => Cr(o, t)).get("/favicon.ico", () => new Response(null, { status: 200 })).get("/sub", (o) => n.toSub(o, t)).post("/api/add", (o) => n.add(o)).delete("/api/delete", (o) => n.delete(o)).get("/api/queryByCode", (o) => n.queryByCode(o)).get("/api/queryList", (o) => n.queryList(o)).get("/:code", (o) => n.redirect(o));
      const i = await wt.handle(e, t);
      return C.cors(i);
    } catch (r) {
      return C.error(r.message || r);
    }
  }
};
export {
  lo as default
};
