var ir = Object.defineProperty;
var tt = (e) => {
  throw TypeError(e);
};
var nr = (e, r, t) => r in e ? ir(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t;
var _ = (e, r, t) => nr(e, typeof r != "symbol" ? r + "" : r, t), He = (e, r, t) => r.has(e) || tt("Cannot " + t);
var u = (e, r, t) => (He(e, r, "read from private field"), t ? t.call(e) : r.get(e)), x = (e, r, t) => r.has(e) ? tt("Cannot add the same private member more than once") : r instanceof WeakSet ? r.add(e) : r.set(e, t), g = (e, r, t, i) => (He(e, r, "write to private field"), i ? i.call(e, t) : r.set(e, t), t), rt = (e, r, t) => (He(e, r, "access private method"), t);
function _t() {
  return [
    { label: "Clash", value: "clash" },
    { label: "Sing-box", value: "singbox" },
    { label: "v2ray", value: "v2ray" }
  ];
}
class C {
  static json(r, t = 200) {
    return new Response(JSON.stringify(r), {
      status: t,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }
  static error(r, t = 400) {
    return this.json({ error: r }, t);
  }
  static success(r) {
    return this.json({ data: r });
  }
  static cors(r) {
    const t = new Headers(r.headers);
    return t.set("Access-Control-Allow-Origin", "*"), t.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"), t.set("Access-Control-Allow-Headers", "Content-Type"), new Response(r.body, {
      status: r.status,
      statusText: r.statusText,
      headers: t
    });
  }
}
class or {
  constructor(r) {
    this.service = r;
  }
  async toSub(r, t) {
    try {
      const i = new URL(r.url).searchParams.get("target");
      if (!i)
        return C.error("Unsupported client type");
      const o = _t().map((a) => a.value);
      if (!o.includes(i))
        return C.error(`Unsupported client type, support list: ${o.join(", ")}`);
      const s = await this.service.toSub(r, t, i);
      return C.cors(s);
    } catch (i) {
      return C.error(i.message || "Invalid request");
    }
  }
  async add(r) {
    try {
      const { long_url: t, serve: i } = await r.json();
      if (!t)
        return C.error("Missing long_url");
      const n = new URL(r.url), o = i || `${n.protocol}//${n.host}`, s = await this.service.add(t, o);
      return C.success(s);
    } catch (t) {
      return C.error(t.message || "Invalid request");
    }
  }
  async delete(r) {
    try {
      const i = new URL(r.url).searchParams.get("code");
      return i ? (await this.service.deleteByCode(i), C.success({ deleted: !0 })) : C.error("Missing code");
    } catch (t) {
      return C.error(t.message || "Invalid request");
    }
  }
  async queryByCode(r) {
    try {
      const i = new URL(r.url).searchParams.get("code");
      if (!i)
        return C.error("Missing code");
      const n = await this.service.getByCode(i);
      return n ? C.success(n) : C.error("Not found", 404);
    } catch (t) {
      return C.error(t.message || "Invalid request");
    }
  }
  async queryList(r) {
    try {
      const t = new URL(r.url), i = Number.parseInt(t.searchParams.get("page") || "1"), n = Number.parseInt(t.searchParams.get("pageSize") || "10"), o = await this.service.getList(i, n);
      return C.success(o);
    } catch (t) {
      return C.error(t.message || "Invalid request");
    }
  }
  async redirect(r) {
    var t;
    try {
      const i = (t = r.params) == null ? void 0 : t.code;
      if (!i)
        return C.error("Invalid short URL");
      const n = await this.service.getByCode(i);
      return n ? Response.redirect(n.long_url, 302) : C.error("Not found", 404);
    } catch (i) {
      return C.error(i.message || "Invalid request");
    }
  }
}
class sr {
  constructor() {
    _(this, "routes", []);
  }
  get(r, t) {
    return this.add("GET", r, t), this;
  }
  post(r, t) {
    return this.add("POST", r, t), this;
  }
  put(r, t) {
    return this.add("PUT", r, t), this;
  }
  delete(r, t) {
    return this.add("DELETE", r, t), this;
  }
  add(r, t, i) {
    const n = t.startsWith("/") ? t : `/${t}`;
    this.routes.push({
      pattern: new URLPattern({ pathname: n }),
      handler: async (o, s) => o.method !== r ? new Response("Method Not Allowed", { status: 405 }) : i(o, s)
    });
  }
  async handle(r, t) {
    const i = new URL(r.url);
    for (const n of this.routes) {
      const o = n.pattern.exec(i);
      if (o) {
        const s = o.pathname.groups;
        return Object.defineProperty(r, "params", {
          value: s,
          writable: !1
        }), n.handler(r, t);
      }
    }
    return new Response("Not Found", { status: 404 });
  }
}
function ar() {
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
function lr() {
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
function cr() {
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
function ur() {
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
function pr() {
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
function dr() {
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
function St() {
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
const hr = St();
function fr() {
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
                arrow.innerHTML = \`${hr.arrow}\`;

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
const it = St();
function mr() {
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
function gr() {
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
function br() {
  return [
    { label: "Emoji", value: "emoji" },
    { label: "Clash New Field", value: "new_name" },
    { label: "启用 UDP", value: "udp" },
    { label: "排序节点", value: "sort" },
    { label: "启用TFO", value: "tfo" }
  ];
}
function vr(e, r) {
  var n;
  const { origin: t } = new URL(e.url);
  return (((n = r.BACKEND) == null ? void 0 : n.split(`
`).filter(Boolean)) ?? []).reduce(
    (o, s) => (o.unshift({ label: s, value: s }), o),
    [
      { label: t, value: t },
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
function xr() {
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
function wr(e) {
  var t;
  return (((t = e.REMOTE_CONFIG) == null ? void 0 : t.split(`
`).filter(Boolean)) ?? []).reduce(
    (i, n) => (i.unshift({
      label: n,
      value: n
    }), i),
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
function yr(e, r) {
  if (r.DB === void 0)
    return [];
  const { origin: t } = new URL(e.url);
  return [{ label: t, value: t }];
}
function Cr() {
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
function _r() {
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
function Sr() {
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
function Ar(e, r) {
  var d;
  const t = wr(r), i = vr(e, r), n = yr(e, r), o = _t(), s = br(), a = xr(), l = r.DB !== void 0, c = `  
    <!DOCTYPE html>
        <html lang="en" theme="dark">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Sub Converter</title>

                ${Sr()}
                ${_r()}

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
                ${Cr()}

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

                ${pr()}
                ${gr()}
                ${mr()}
                ${fr()}
                ${lr()}
                ${ur()}
                ${cr()}
                ${ar()}
                ${dr()}

                <script>
                    const formConfig = {
                        target: {
                            type: 'sub-select',
                            options: ${JSON.stringify(o)}
                        },
                        config: {
                            type: 'sub-select',
                            options: ${JSON.stringify(t)}
                        },
                        backend: {
                            type: 'sub-select',
                            options: ${JSON.stringify(i)}
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
                            options: ${JSON.stringify(n)}
                        }
                    };

                    class Sub {
                        #model = {
                            target: '${o[0].value}',
                            config: '${t[0].value}',
                            backend: '${i[0].value}',
                            protocol: '${JSON.stringify(a.map((p) => p.value))}',
                            advanced: ['emoji', 'new_name'],
                            shortServe: '${((d = n[0]) == null ? void 0 : d.value) ?? ""}',

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
function At(e) {
  return typeof e > "u" || e === null;
}
function Er(e) {
  return typeof e == "object" && e !== null;
}
function kr(e) {
  return Array.isArray(e) ? e : At(e) ? [] : [e];
}
function Lr(e, r) {
  var t, i, n, o;
  if (r)
    for (o = Object.keys(r), t = 0, i = o.length; t < i; t += 1)
      n = o[t], e[n] = r[n];
  return e;
}
function Or(e, r) {
  var t = "", i;
  for (i = 0; i < r; i += 1)
    t += e;
  return t;
}
function Rr(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
var Tr = At, Nr = Er, Ir = kr, Fr = Or, Pr = Rr, Mr = Lr, A = {
  isNothing: Tr,
  isObject: Nr,
  toArray: Ir,
  repeat: Fr,
  isNegativeZero: Pr,
  extend: Mr
};
function Et(e, r) {
  var t = "", i = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (t += 'in "' + e.mark.name + '" '), t += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !r && e.mark.snippet && (t += `

` + e.mark.snippet), i + " " + t) : i;
}
function be(e, r) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = r, this.message = Et(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
be.prototype = Object.create(Error.prototype);
be.prototype.constructor = be;
be.prototype.toString = function(r) {
  return this.name + ": " + Et(this, r);
};
var R = be;
function Be(e, r, t, i, n) {
  var o = "", s = "", a = Math.floor(n / 2) - 1;
  return i - r > a && (o = " ... ", r = i - a + o.length), t - i > a && (s = " ...", t = i + a - s.length), {
    str: o + e.slice(r, t).replace(/\t/g, "→") + s,
    pos: i - r + o.length
    // relative position
  };
}
function je(e, r) {
  return A.repeat(" ", r - e.length) + e;
}
function Ur(e, r) {
  if (r = Object.create(r || null), !e.buffer) return null;
  r.maxLength || (r.maxLength = 79), typeof r.indent != "number" && (r.indent = 1), typeof r.linesBefore != "number" && (r.linesBefore = 3), typeof r.linesAfter != "number" && (r.linesAfter = 2);
  for (var t = /\r?\n|\r|\0/g, i = [0], n = [], o, s = -1; o = t.exec(e.buffer); )
    n.push(o.index), i.push(o.index + o[0].length), e.position <= o.index && s < 0 && (s = i.length - 2);
  s < 0 && (s = i.length - 1);
  var a = "", l, c, d = Math.min(e.line + r.linesAfter, n.length).toString().length, p = r.maxLength - (r.indent + d + 3);
  for (l = 1; l <= r.linesBefore && !(s - l < 0); l++)
    c = Be(
      e.buffer,
      i[s - l],
      n[s - l],
      e.position - (i[s] - i[s - l]),
      p
    ), a = A.repeat(" ", r.indent) + je((e.line - l + 1).toString(), d) + " | " + c.str + `
` + a;
  for (c = Be(e.buffer, i[s], n[s], e.position, p), a += A.repeat(" ", r.indent) + je((e.line + 1).toString(), d) + " | " + c.str + `
`, a += A.repeat("-", r.indent + d + 3 + c.pos) + `^
`, l = 1; l <= r.linesAfter && !(s + l >= n.length); l++)
    c = Be(
      e.buffer,
      i[s + l],
      n[s + l],
      e.position - (i[s] - i[s + l]),
      p
    ), a += A.repeat(" ", r.indent) + je((e.line + l + 1).toString(), d) + " | " + c.str + `
`;
  return a.replace(/\n$/, "");
}
var Dr = Ur, Vr = [
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
], Hr = [
  "scalar",
  "sequence",
  "mapping"
];
function Br(e) {
  var r = {};
  return e !== null && Object.keys(e).forEach(function(t) {
    e[t].forEach(function(i) {
      r[String(i)] = t;
    });
  }), r;
}
function jr(e, r) {
  if (r = r || {}, Object.keys(r).forEach(function(t) {
    if (Vr.indexOf(t) === -1)
      throw new R('Unknown option "' + t + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = r, this.tag = e, this.kind = r.kind || null, this.resolve = r.resolve || function() {
    return !0;
  }, this.construct = r.construct || function(t) {
    return t;
  }, this.instanceOf = r.instanceOf || null, this.predicate = r.predicate || null, this.represent = r.represent || null, this.representName = r.representName || null, this.defaultStyle = r.defaultStyle || null, this.multi = r.multi || !1, this.styleAliases = Br(r.styleAliases || null), Hr.indexOf(this.kind) === -1)
    throw new R('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var E = jr;
function nt(e, r) {
  var t = [];
  return e[r].forEach(function(i) {
    var n = t.length;
    t.forEach(function(o, s) {
      o.tag === i.tag && o.kind === i.kind && o.multi === i.multi && (n = s);
    }), t[n] = i;
  }), t;
}
function $r() {
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
  }, r, t;
  function i(n) {
    n.multi ? (e.multi[n.kind].push(n), e.multi.fallback.push(n)) : e[n.kind][n.tag] = e.fallback[n.tag] = n;
  }
  for (r = 0, t = arguments.length; r < t; r += 1)
    arguments[r].forEach(i);
  return e;
}
function ze(e) {
  return this.extend(e);
}
ze.prototype.extend = function(r) {
  var t = [], i = [];
  if (r instanceof E)
    i.push(r);
  else if (Array.isArray(r))
    i = i.concat(r);
  else if (r && (Array.isArray(r.implicit) || Array.isArray(r.explicit)))
    r.implicit && (t = t.concat(r.implicit)), r.explicit && (i = i.concat(r.explicit));
  else
    throw new R("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  t.forEach(function(o) {
    if (!(o instanceof E))
      throw new R("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (o.loadKind && o.loadKind !== "scalar")
      throw new R("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (o.multi)
      throw new R("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), i.forEach(function(o) {
    if (!(o instanceof E))
      throw new R("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var n = Object.create(ze.prototype);
  return n.implicit = (this.implicit || []).concat(t), n.explicit = (this.explicit || []).concat(i), n.compiledImplicit = nt(n, "implicit"), n.compiledExplicit = nt(n, "explicit"), n.compiledTypeMap = $r(n.compiledImplicit, n.compiledExplicit), n;
};
var zr = ze, Yr = new E("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), qr = new E("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), Wr = new E("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), Gr = new zr({
  explicit: [
    Yr,
    qr,
    Wr
  ]
});
function Kr(e) {
  if (e === null) return !0;
  var r = e.length;
  return r === 1 && e === "~" || r === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function Jr() {
  return null;
}
function Qr(e) {
  return e === null;
}
var Xr = new E("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: Kr,
  construct: Jr,
  predicate: Qr,
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
function Zr(e) {
  if (e === null) return !1;
  var r = e.length;
  return r === 4 && (e === "true" || e === "True" || e === "TRUE") || r === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function ei(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function ti(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var ri = new E("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: Zr,
  construct: ei,
  predicate: ti,
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
function ii(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function ni(e) {
  return 48 <= e && e <= 55;
}
function oi(e) {
  return 48 <= e && e <= 57;
}
function si(e) {
  if (e === null) return !1;
  var r = e.length, t = 0, i = !1, n;
  if (!r) return !1;
  if (n = e[t], (n === "-" || n === "+") && (n = e[++t]), n === "0") {
    if (t + 1 === r) return !0;
    if (n = e[++t], n === "b") {
      for (t++; t < r; t++)
        if (n = e[t], n !== "_") {
          if (n !== "0" && n !== "1") return !1;
          i = !0;
        }
      return i && n !== "_";
    }
    if (n === "x") {
      for (t++; t < r; t++)
        if (n = e[t], n !== "_") {
          if (!ii(e.charCodeAt(t))) return !1;
          i = !0;
        }
      return i && n !== "_";
    }
    if (n === "o") {
      for (t++; t < r; t++)
        if (n = e[t], n !== "_") {
          if (!ni(e.charCodeAt(t))) return !1;
          i = !0;
        }
      return i && n !== "_";
    }
  }
  if (n === "_") return !1;
  for (; t < r; t++)
    if (n = e[t], n !== "_") {
      if (!oi(e.charCodeAt(t)))
        return !1;
      i = !0;
    }
  return !(!i || n === "_");
}
function ai(e) {
  var r = e, t = 1, i;
  if (r.indexOf("_") !== -1 && (r = r.replace(/_/g, "")), i = r[0], (i === "-" || i === "+") && (i === "-" && (t = -1), r = r.slice(1), i = r[0]), r === "0") return 0;
  if (i === "0") {
    if (r[1] === "b") return t * parseInt(r.slice(2), 2);
    if (r[1] === "x") return t * parseInt(r.slice(2), 16);
    if (r[1] === "o") return t * parseInt(r.slice(2), 8);
  }
  return t * parseInt(r, 10);
}
function li(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !A.isNegativeZero(e);
}
var ci = new E("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: si,
  construct: ai,
  predicate: li,
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
}), ui = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function pi(e) {
  return !(e === null || !ui.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function di(e) {
  var r, t;
  return r = e.replace(/_/g, "").toLowerCase(), t = r[0] === "-" ? -1 : 1, "+-".indexOf(r[0]) >= 0 && (r = r.slice(1)), r === ".inf" ? t === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : r === ".nan" ? NaN : t * parseFloat(r, 10);
}
var hi = /^[-+]?[0-9]+e/;
function fi(e, r) {
  var t;
  if (isNaN(e))
    switch (r) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  else if (Number.POSITIVE_INFINITY === e)
    switch (r) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  else if (Number.NEGATIVE_INFINITY === e)
    switch (r) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  else if (A.isNegativeZero(e))
    return "-0.0";
  return t = e.toString(10), hi.test(t) ? t.replace("e", ".e") : t;
}
function mi(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || A.isNegativeZero(e));
}
var gi = new E("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: pi,
  construct: di,
  predicate: mi,
  represent: fi,
  defaultStyle: "lowercase"
}), bi = Gr.extend({
  implicit: [
    Xr,
    ri,
    ci,
    gi
  ]
}), vi = bi, kt = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), Lt = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function xi(e) {
  return e === null ? !1 : kt.exec(e) !== null || Lt.exec(e) !== null;
}
function wi(e) {
  var r, t, i, n, o, s, a, l = 0, c = null, d, p, h;
  if (r = kt.exec(e), r === null && (r = Lt.exec(e)), r === null) throw new Error("Date resolve error");
  if (t = +r[1], i = +r[2] - 1, n = +r[3], !r[4])
    return new Date(Date.UTC(t, i, n));
  if (o = +r[4], s = +r[5], a = +r[6], r[7]) {
    for (l = r[7].slice(0, 3); l.length < 3; )
      l += "0";
    l = +l;
  }
  return r[9] && (d = +r[10], p = +(r[11] || 0), c = (d * 60 + p) * 6e4, r[9] === "-" && (c = -c)), h = new Date(Date.UTC(t, i, n, o, s, a, l)), c && h.setTime(h.getTime() - c), h;
}
function yi(e) {
  return e.toISOString();
}
var Ci = new E("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: xi,
  construct: wi,
  instanceOf: Date,
  represent: yi
});
function _i(e) {
  return e === "<<" || e === null;
}
var Si = new E("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: _i
}), Je = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function Ai(e) {
  if (e === null) return !1;
  var r, t, i = 0, n = e.length, o = Je;
  for (t = 0; t < n; t++)
    if (r = o.indexOf(e.charAt(t)), !(r > 64)) {
      if (r < 0) return !1;
      i += 6;
    }
  return i % 8 === 0;
}
function Ei(e) {
  var r, t, i = e.replace(/[\r\n=]/g, ""), n = i.length, o = Je, s = 0, a = [];
  for (r = 0; r < n; r++)
    r % 4 === 0 && r && (a.push(s >> 16 & 255), a.push(s >> 8 & 255), a.push(s & 255)), s = s << 6 | o.indexOf(i.charAt(r));
  return t = n % 4 * 6, t === 0 ? (a.push(s >> 16 & 255), a.push(s >> 8 & 255), a.push(s & 255)) : t === 18 ? (a.push(s >> 10 & 255), a.push(s >> 2 & 255)) : t === 12 && a.push(s >> 4 & 255), new Uint8Array(a);
}
function ki(e) {
  var r = "", t = 0, i, n, o = e.length, s = Je;
  for (i = 0; i < o; i++)
    i % 3 === 0 && i && (r += s[t >> 18 & 63], r += s[t >> 12 & 63], r += s[t >> 6 & 63], r += s[t & 63]), t = (t << 8) + e[i];
  return n = o % 3, n === 0 ? (r += s[t >> 18 & 63], r += s[t >> 12 & 63], r += s[t >> 6 & 63], r += s[t & 63]) : n === 2 ? (r += s[t >> 10 & 63], r += s[t >> 4 & 63], r += s[t << 2 & 63], r += s[64]) : n === 1 && (r += s[t >> 2 & 63], r += s[t << 4 & 63], r += s[64], r += s[64]), r;
}
function Li(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var Oi = new E("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: Ai,
  construct: Ei,
  predicate: Li,
  represent: ki
}), Ri = Object.prototype.hasOwnProperty, Ti = Object.prototype.toString;
function Ni(e) {
  if (e === null) return !0;
  var r = [], t, i, n, o, s, a = e;
  for (t = 0, i = a.length; t < i; t += 1) {
    if (n = a[t], s = !1, Ti.call(n) !== "[object Object]") return !1;
    for (o in n)
      if (Ri.call(n, o))
        if (!s) s = !0;
        else return !1;
    if (!s) return !1;
    if (r.indexOf(o) === -1) r.push(o);
    else return !1;
  }
  return !0;
}
function Ii(e) {
  return e !== null ? e : [];
}
var Fi = new E("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: Ni,
  construct: Ii
}), Pi = Object.prototype.toString;
function Mi(e) {
  if (e === null) return !0;
  var r, t, i, n, o, s = e;
  for (o = new Array(s.length), r = 0, t = s.length; r < t; r += 1) {
    if (i = s[r], Pi.call(i) !== "[object Object]" || (n = Object.keys(i), n.length !== 1)) return !1;
    o[r] = [n[0], i[n[0]]];
  }
  return !0;
}
function Ui(e) {
  if (e === null) return [];
  var r, t, i, n, o, s = e;
  for (o = new Array(s.length), r = 0, t = s.length; r < t; r += 1)
    i = s[r], n = Object.keys(i), o[r] = [n[0], i[n[0]]];
  return o;
}
var Di = new E("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: Mi,
  construct: Ui
}), Vi = Object.prototype.hasOwnProperty;
function Hi(e) {
  if (e === null) return !0;
  var r, t = e;
  for (r in t)
    if (Vi.call(t, r) && t[r] !== null)
      return !1;
  return !0;
}
function Bi(e) {
  return e !== null ? e : {};
}
var ji = new E("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: Hi,
  construct: Bi
}), Ot = vi.extend({
  implicit: [
    Ci,
    Si
  ],
  explicit: [
    Oi,
    Fi,
    Di,
    ji
  ]
}), q = Object.prototype.hasOwnProperty, Ne = 1, Rt = 2, Tt = 3, Ie = 4, $e = 1, $i = 2, ot = 3, zi = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, Yi = /[\x85\u2028\u2029]/, qi = /[,\[\]\{\}]/, Nt = /^(?:!|!!|![a-z\-]+!)$/i, It = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function st(e) {
  return Object.prototype.toString.call(e);
}
function D(e) {
  return e === 10 || e === 13;
}
function ne(e) {
  return e === 9 || e === 32;
}
function T(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function ae(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function Wi(e) {
  var r;
  return 48 <= e && e <= 57 ? e - 48 : (r = e | 32, 97 <= r && r <= 102 ? r - 97 + 10 : -1);
}
function Gi(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function Ki(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function at(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function Ji(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
var Ft = new Array(256), Pt = new Array(256);
for (var oe = 0; oe < 256; oe++)
  Ft[oe] = at(oe) ? 1 : 0, Pt[oe] = at(oe);
function Qi(e, r) {
  this.input = e, this.filename = r.filename || null, this.schema = r.schema || Ot, this.onWarning = r.onWarning || null, this.legacy = r.legacy || !1, this.json = r.json || !1, this.listener = r.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function Mt(e, r) {
  var t = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return t.snippet = Dr(t), new R(r, t);
}
function m(e, r) {
  throw Mt(e, r);
}
function Fe(e, r) {
  e.onWarning && e.onWarning.call(null, Mt(e, r));
}
var lt = {
  YAML: function(r, t, i) {
    var n, o, s;
    r.version !== null && m(r, "duplication of %YAML directive"), i.length !== 1 && m(r, "YAML directive accepts exactly one argument"), n = /^([0-9]+)\.([0-9]+)$/.exec(i[0]), n === null && m(r, "ill-formed argument of the YAML directive"), o = parseInt(n[1], 10), s = parseInt(n[2], 10), o !== 1 && m(r, "unacceptable YAML version of the document"), r.version = i[0], r.checkLineBreaks = s < 2, s !== 1 && s !== 2 && Fe(r, "unsupported YAML version of the document");
  },
  TAG: function(r, t, i) {
    var n, o;
    i.length !== 2 && m(r, "TAG directive accepts exactly two arguments"), n = i[0], o = i[1], Nt.test(n) || m(r, "ill-formed tag handle (first argument) of the TAG directive"), q.call(r.tagMap, n) && m(r, 'there is a previously declared suffix for "' + n + '" tag handle'), It.test(o) || m(r, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      o = decodeURIComponent(o);
    } catch {
      m(r, "tag prefix is malformed: " + o);
    }
    r.tagMap[n] = o;
  }
};
function Y(e, r, t, i) {
  var n, o, s, a;
  if (r < t) {
    if (a = e.input.slice(r, t), i)
      for (n = 0, o = a.length; n < o; n += 1)
        s = a.charCodeAt(n), s === 9 || 32 <= s && s <= 1114111 || m(e, "expected valid JSON character");
    else zi.test(a) && m(e, "the stream contains non-printable characters");
    e.result += a;
  }
}
function ct(e, r, t, i) {
  var n, o, s, a;
  for (A.isObject(t) || m(e, "cannot merge mappings; the provided source object is unacceptable"), n = Object.keys(t), s = 0, a = n.length; s < a; s += 1)
    o = n[s], q.call(r, o) || (r[o] = t[o], i[o] = !0);
}
function le(e, r, t, i, n, o, s, a, l) {
  var c, d;
  if (Array.isArray(n))
    for (n = Array.prototype.slice.call(n), c = 0, d = n.length; c < d; c += 1)
      Array.isArray(n[c]) && m(e, "nested arrays are not supported inside keys"), typeof n == "object" && st(n[c]) === "[object Object]" && (n[c] = "[object Object]");
  if (typeof n == "object" && st(n) === "[object Object]" && (n = "[object Object]"), n = String(n), r === null && (r = {}), i === "tag:yaml.org,2002:merge")
    if (Array.isArray(o))
      for (c = 0, d = o.length; c < d; c += 1)
        ct(e, r, o[c], t);
    else
      ct(e, r, o, t);
  else
    !e.json && !q.call(t, n) && q.call(r, n) && (e.line = s || e.line, e.lineStart = a || e.lineStart, e.position = l || e.position, m(e, "duplicated mapping key")), n === "__proto__" ? Object.defineProperty(r, n, {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: o
    }) : r[n] = o, delete t[n];
  return r;
}
function Qe(e) {
  var r;
  r = e.input.charCodeAt(e.position), r === 10 ? e.position++ : r === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : m(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function S(e, r, t) {
  for (var i = 0, n = e.input.charCodeAt(e.position); n !== 0; ) {
    for (; ne(n); )
      n === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), n = e.input.charCodeAt(++e.position);
    if (r && n === 35)
      do
        n = e.input.charCodeAt(++e.position);
      while (n !== 10 && n !== 13 && n !== 0);
    if (D(n))
      for (Qe(e), n = e.input.charCodeAt(e.position), i++, e.lineIndent = 0; n === 32; )
        e.lineIndent++, n = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return t !== -1 && i !== 0 && e.lineIndent < t && Fe(e, "deficient indentation"), i;
}
function Ve(e) {
  var r = e.position, t;
  return t = e.input.charCodeAt(r), !!((t === 45 || t === 46) && t === e.input.charCodeAt(r + 1) && t === e.input.charCodeAt(r + 2) && (r += 3, t = e.input.charCodeAt(r), t === 0 || T(t)));
}
function Xe(e, r) {
  r === 1 ? e.result += " " : r > 1 && (e.result += A.repeat(`
`, r - 1));
}
function Xi(e, r, t) {
  var i, n, o, s, a, l, c, d, p = e.kind, h = e.result, f;
  if (f = e.input.charCodeAt(e.position), T(f) || ae(f) || f === 35 || f === 38 || f === 42 || f === 33 || f === 124 || f === 62 || f === 39 || f === 34 || f === 37 || f === 64 || f === 96 || (f === 63 || f === 45) && (n = e.input.charCodeAt(e.position + 1), T(n) || t && ae(n)))
    return !1;
  for (e.kind = "scalar", e.result = "", o = s = e.position, a = !1; f !== 0; ) {
    if (f === 58) {
      if (n = e.input.charCodeAt(e.position + 1), T(n) || t && ae(n))
        break;
    } else if (f === 35) {
      if (i = e.input.charCodeAt(e.position - 1), T(i))
        break;
    } else {
      if (e.position === e.lineStart && Ve(e) || t && ae(f))
        break;
      if (D(f))
        if (l = e.line, c = e.lineStart, d = e.lineIndent, S(e, !1, -1), e.lineIndent >= r) {
          a = !0, f = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = s, e.line = l, e.lineStart = c, e.lineIndent = d;
          break;
        }
    }
    a && (Y(e, o, s, !1), Xe(e, e.line - l), o = s = e.position, a = !1), ne(f) || (s = e.position + 1), f = e.input.charCodeAt(++e.position);
  }
  return Y(e, o, s, !1), e.result ? !0 : (e.kind = p, e.result = h, !1);
}
function Zi(e, r) {
  var t, i, n;
  if (t = e.input.charCodeAt(e.position), t !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, i = n = e.position; (t = e.input.charCodeAt(e.position)) !== 0; )
    if (t === 39)
      if (Y(e, i, e.position, !0), t = e.input.charCodeAt(++e.position), t === 39)
        i = e.position, e.position++, n = e.position;
      else
        return !0;
    else D(t) ? (Y(e, i, n, !0), Xe(e, S(e, !1, r)), i = n = e.position) : e.position === e.lineStart && Ve(e) ? m(e, "unexpected end of the document within a single quoted scalar") : (e.position++, n = e.position);
  m(e, "unexpected end of the stream within a single quoted scalar");
}
function en(e, r) {
  var t, i, n, o, s, a;
  if (a = e.input.charCodeAt(e.position), a !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, t = i = e.position; (a = e.input.charCodeAt(e.position)) !== 0; ) {
    if (a === 34)
      return Y(e, t, e.position, !0), e.position++, !0;
    if (a === 92) {
      if (Y(e, t, e.position, !0), a = e.input.charCodeAt(++e.position), D(a))
        S(e, !1, r);
      else if (a < 256 && Ft[a])
        e.result += Pt[a], e.position++;
      else if ((s = Gi(a)) > 0) {
        for (n = s, o = 0; n > 0; n--)
          a = e.input.charCodeAt(++e.position), (s = Wi(a)) >= 0 ? o = (o << 4) + s : m(e, "expected hexadecimal character");
        e.result += Ji(o), e.position++;
      } else
        m(e, "unknown escape sequence");
      t = i = e.position;
    } else D(a) ? (Y(e, t, i, !0), Xe(e, S(e, !1, r)), t = i = e.position) : e.position === e.lineStart && Ve(e) ? m(e, "unexpected end of the document within a double quoted scalar") : (e.position++, i = e.position);
  }
  m(e, "unexpected end of the stream within a double quoted scalar");
}
function tn(e, r) {
  var t = !0, i, n, o, s = e.tag, a, l = e.anchor, c, d, p, h, f, b = /* @__PURE__ */ Object.create(null), v, y, O, w;
  if (w = e.input.charCodeAt(e.position), w === 91)
    d = 93, f = !1, a = [];
  else if (w === 123)
    d = 125, f = !0, a = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = a), w = e.input.charCodeAt(++e.position); w !== 0; ) {
    if (S(e, !0, r), w = e.input.charCodeAt(e.position), w === d)
      return e.position++, e.tag = s, e.anchor = l, e.kind = f ? "mapping" : "sequence", e.result = a, !0;
    t ? w === 44 && m(e, "expected the node content, but found ','") : m(e, "missed comma between flow collection entries"), y = v = O = null, p = h = !1, w === 63 && (c = e.input.charCodeAt(e.position + 1), T(c) && (p = h = !0, e.position++, S(e, !0, r))), i = e.line, n = e.lineStart, o = e.position, me(e, r, Ne, !1, !0), y = e.tag, v = e.result, S(e, !0, r), w = e.input.charCodeAt(e.position), (h || e.line === i) && w === 58 && (p = !0, w = e.input.charCodeAt(++e.position), S(e, !0, r), me(e, r, Ne, !1, !0), O = e.result), f ? le(e, a, b, y, v, O, i, n, o) : p ? a.push(le(e, null, b, y, v, O, i, n, o)) : a.push(v), S(e, !0, r), w = e.input.charCodeAt(e.position), w === 44 ? (t = !0, w = e.input.charCodeAt(++e.position)) : t = !1;
  }
  m(e, "unexpected end of the stream within a flow collection");
}
function rn(e, r) {
  var t, i, n = $e, o = !1, s = !1, a = r, l = 0, c = !1, d, p;
  if (p = e.input.charCodeAt(e.position), p === 124)
    i = !1;
  else if (p === 62)
    i = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; p !== 0; )
    if (p = e.input.charCodeAt(++e.position), p === 43 || p === 45)
      $e === n ? n = p === 43 ? ot : $i : m(e, "repeat of a chomping mode identifier");
    else if ((d = Ki(p)) >= 0)
      d === 0 ? m(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : s ? m(e, "repeat of an indentation width identifier") : (a = r + d - 1, s = !0);
    else
      break;
  if (ne(p)) {
    do
      p = e.input.charCodeAt(++e.position);
    while (ne(p));
    if (p === 35)
      do
        p = e.input.charCodeAt(++e.position);
      while (!D(p) && p !== 0);
  }
  for (; p !== 0; ) {
    for (Qe(e), e.lineIndent = 0, p = e.input.charCodeAt(e.position); (!s || e.lineIndent < a) && p === 32; )
      e.lineIndent++, p = e.input.charCodeAt(++e.position);
    if (!s && e.lineIndent > a && (a = e.lineIndent), D(p)) {
      l++;
      continue;
    }
    if (e.lineIndent < a) {
      n === ot ? e.result += A.repeat(`
`, o ? 1 + l : l) : n === $e && o && (e.result += `
`);
      break;
    }
    for (i ? ne(p) ? (c = !0, e.result += A.repeat(`
`, o ? 1 + l : l)) : c ? (c = !1, e.result += A.repeat(`
`, l + 1)) : l === 0 ? o && (e.result += " ") : e.result += A.repeat(`
`, l) : e.result += A.repeat(`
`, o ? 1 + l : l), o = !0, s = !0, l = 0, t = e.position; !D(p) && p !== 0; )
      p = e.input.charCodeAt(++e.position);
    Y(e, t, e.position, !1);
  }
  return !0;
}
function ut(e, r) {
  var t, i = e.tag, n = e.anchor, o = [], s, a = !1, l;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), l = e.input.charCodeAt(e.position); l !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, m(e, "tab characters must not be used in indentation")), !(l !== 45 || (s = e.input.charCodeAt(e.position + 1), !T(s)))); ) {
    if (a = !0, e.position++, S(e, !0, -1) && e.lineIndent <= r) {
      o.push(null), l = e.input.charCodeAt(e.position);
      continue;
    }
    if (t = e.line, me(e, r, Tt, !1, !0), o.push(e.result), S(e, !0, -1), l = e.input.charCodeAt(e.position), (e.line === t || e.lineIndent > r) && l !== 0)
      m(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < r)
      break;
  }
  return a ? (e.tag = i, e.anchor = n, e.kind = "sequence", e.result = o, !0) : !1;
}
function nn(e, r, t) {
  var i, n, o, s, a, l, c = e.tag, d = e.anchor, p = {}, h = /* @__PURE__ */ Object.create(null), f = null, b = null, v = null, y = !1, O = !1, w;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = p), w = e.input.charCodeAt(e.position); w !== 0; ) {
    if (!y && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, m(e, "tab characters must not be used in indentation")), i = e.input.charCodeAt(e.position + 1), o = e.line, (w === 63 || w === 58) && T(i))
      w === 63 ? (y && (le(e, p, h, f, b, null, s, a, l), f = b = v = null), O = !0, y = !0, n = !0) : y ? (y = !1, n = !0) : m(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, w = i;
    else {
      if (s = e.line, a = e.lineStart, l = e.position, !me(e, t, Rt, !1, !0))
        break;
      if (e.line === o) {
        for (w = e.input.charCodeAt(e.position); ne(w); )
          w = e.input.charCodeAt(++e.position);
        if (w === 58)
          w = e.input.charCodeAt(++e.position), T(w) || m(e, "a whitespace character is expected after the key-value separator within a block mapping"), y && (le(e, p, h, f, b, null, s, a, l), f = b = v = null), O = !0, y = !1, n = !1, f = e.tag, b = e.result;
        else if (O)
          m(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = c, e.anchor = d, !0;
      } else if (O)
        m(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = c, e.anchor = d, !0;
    }
    if ((e.line === o || e.lineIndent > r) && (y && (s = e.line, a = e.lineStart, l = e.position), me(e, r, Ie, !0, n) && (y ? b = e.result : v = e.result), y || (le(e, p, h, f, b, v, s, a, l), f = b = v = null), S(e, !0, -1), w = e.input.charCodeAt(e.position)), (e.line === o || e.lineIndent > r) && w !== 0)
      m(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < r)
      break;
  }
  return y && le(e, p, h, f, b, null, s, a, l), O && (e.tag = c, e.anchor = d, e.kind = "mapping", e.result = p), O;
}
function on(e) {
  var r, t = !1, i = !1, n, o, s;
  if (s = e.input.charCodeAt(e.position), s !== 33) return !1;
  if (e.tag !== null && m(e, "duplication of a tag property"), s = e.input.charCodeAt(++e.position), s === 60 ? (t = !0, s = e.input.charCodeAt(++e.position)) : s === 33 ? (i = !0, n = "!!", s = e.input.charCodeAt(++e.position)) : n = "!", r = e.position, t) {
    do
      s = e.input.charCodeAt(++e.position);
    while (s !== 0 && s !== 62);
    e.position < e.length ? (o = e.input.slice(r, e.position), s = e.input.charCodeAt(++e.position)) : m(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; s !== 0 && !T(s); )
      s === 33 && (i ? m(e, "tag suffix cannot contain exclamation marks") : (n = e.input.slice(r - 1, e.position + 1), Nt.test(n) || m(e, "named tag handle cannot contain such characters"), i = !0, r = e.position + 1)), s = e.input.charCodeAt(++e.position);
    o = e.input.slice(r, e.position), qi.test(o) && m(e, "tag suffix cannot contain flow indicator characters");
  }
  o && !It.test(o) && m(e, "tag name cannot contain such characters: " + o);
  try {
    o = decodeURIComponent(o);
  } catch {
    m(e, "tag name is malformed: " + o);
  }
  return t ? e.tag = o : q.call(e.tagMap, n) ? e.tag = e.tagMap[n] + o : n === "!" ? e.tag = "!" + o : n === "!!" ? e.tag = "tag:yaml.org,2002:" + o : m(e, 'undeclared tag handle "' + n + '"'), !0;
}
function sn(e) {
  var r, t;
  if (t = e.input.charCodeAt(e.position), t !== 38) return !1;
  for (e.anchor !== null && m(e, "duplication of an anchor property"), t = e.input.charCodeAt(++e.position), r = e.position; t !== 0 && !T(t) && !ae(t); )
    t = e.input.charCodeAt(++e.position);
  return e.position === r && m(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(r, e.position), !0;
}
function an(e) {
  var r, t, i;
  if (i = e.input.charCodeAt(e.position), i !== 42) return !1;
  for (i = e.input.charCodeAt(++e.position), r = e.position; i !== 0 && !T(i) && !ae(i); )
    i = e.input.charCodeAt(++e.position);
  return e.position === r && m(e, "name of an alias node must contain at least one character"), t = e.input.slice(r, e.position), q.call(e.anchorMap, t) || m(e, 'unidentified alias "' + t + '"'), e.result = e.anchorMap[t], S(e, !0, -1), !0;
}
function me(e, r, t, i, n) {
  var o, s, a, l = 1, c = !1, d = !1, p, h, f, b, v, y;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, o = s = a = Ie === t || Tt === t, i && S(e, !0, -1) && (c = !0, e.lineIndent > r ? l = 1 : e.lineIndent === r ? l = 0 : e.lineIndent < r && (l = -1)), l === 1)
    for (; on(e) || sn(e); )
      S(e, !0, -1) ? (c = !0, a = o, e.lineIndent > r ? l = 1 : e.lineIndent === r ? l = 0 : e.lineIndent < r && (l = -1)) : a = !1;
  if (a && (a = c || n), (l === 1 || Ie === t) && (Ne === t || Rt === t ? v = r : v = r + 1, y = e.position - e.lineStart, l === 1 ? a && (ut(e, y) || nn(e, y, v)) || tn(e, v) ? d = !0 : (s && rn(e, v) || Zi(e, v) || en(e, v) ? d = !0 : an(e) ? (d = !0, (e.tag !== null || e.anchor !== null) && m(e, "alias node should not have any properties")) : Xi(e, v, Ne === t) && (d = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : l === 0 && (d = a && ut(e, y))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && m(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), p = 0, h = e.implicitTypes.length; p < h; p += 1)
      if (b = e.implicitTypes[p], b.resolve(e.result)) {
        e.result = b.construct(e.result), e.tag = b.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (q.call(e.typeMap[e.kind || "fallback"], e.tag))
      b = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (b = null, f = e.typeMap.multi[e.kind || "fallback"], p = 0, h = f.length; p < h; p += 1)
        if (e.tag.slice(0, f[p].tag.length) === f[p].tag) {
          b = f[p];
          break;
        }
    b || m(e, "unknown tag !<" + e.tag + ">"), e.result !== null && b.kind !== e.kind && m(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + b.kind + '", not "' + e.kind + '"'), b.resolve(e.result, e.tag) ? (e.result = b.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : m(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || d;
}
function ln(e) {
  var r = e.position, t, i, n, o = !1, s;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (s = e.input.charCodeAt(e.position)) !== 0 && (S(e, !0, -1), s = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || s !== 37)); ) {
    for (o = !0, s = e.input.charCodeAt(++e.position), t = e.position; s !== 0 && !T(s); )
      s = e.input.charCodeAt(++e.position);
    for (i = e.input.slice(t, e.position), n = [], i.length < 1 && m(e, "directive name must not be less than one character in length"); s !== 0; ) {
      for (; ne(s); )
        s = e.input.charCodeAt(++e.position);
      if (s === 35) {
        do
          s = e.input.charCodeAt(++e.position);
        while (s !== 0 && !D(s));
        break;
      }
      if (D(s)) break;
      for (t = e.position; s !== 0 && !T(s); )
        s = e.input.charCodeAt(++e.position);
      n.push(e.input.slice(t, e.position));
    }
    s !== 0 && Qe(e), q.call(lt, i) ? lt[i](e, i, n) : Fe(e, 'unknown document directive "' + i + '"');
  }
  if (S(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, S(e, !0, -1)) : o && m(e, "directives end mark is expected"), me(e, e.lineIndent - 1, Ie, !1, !0), S(e, !0, -1), e.checkLineBreaks && Yi.test(e.input.slice(r, e.position)) && Fe(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && Ve(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, S(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    m(e, "end of the stream or a document separator is expected");
  else
    return;
}
function cn(e, r) {
  e = String(e), r = r || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var t = new Qi(e, r), i = e.indexOf("\0");
  for (i !== -1 && (t.position = i, m(t, "null byte is not allowed in input")), t.input += "\0"; t.input.charCodeAt(t.position) === 32; )
    t.lineIndent += 1, t.position += 1;
  for (; t.position < t.length - 1; )
    ln(t);
  return t.documents;
}
function un(e, r) {
  var t = cn(e, r);
  if (t.length !== 0) {
    if (t.length === 1)
      return t[0];
    throw new R("expected a single document in the stream, but found more");
  }
}
var pn = un, dn = {
  load: pn
}, Ut = Object.prototype.toString, Dt = Object.prototype.hasOwnProperty, Ze = 65279, hn = 9, ve = 10, fn = 13, mn = 32, gn = 33, bn = 34, Ye = 35, vn = 37, xn = 38, wn = 39, yn = 42, Vt = 44, Cn = 45, Pe = 58, _n = 61, Sn = 62, An = 63, En = 64, Ht = 91, Bt = 93, kn = 96, jt = 123, Ln = 124, $t = 125, k = {};
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
var On = [
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
], Rn = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function Tn(e, r) {
  var t, i, n, o, s, a, l;
  if (r === null) return {};
  for (t = {}, i = Object.keys(r), n = 0, o = i.length; n < o; n += 1)
    s = i[n], a = String(r[s]), s.slice(0, 2) === "!!" && (s = "tag:yaml.org,2002:" + s.slice(2)), l = e.compiledTypeMap.fallback[s], l && Dt.call(l.styleAliases, a) && (a = l.styleAliases[a]), t[s] = a;
  return t;
}
function Nn(e) {
  var r, t, i;
  if (r = e.toString(16).toUpperCase(), e <= 255)
    t = "x", i = 2;
  else if (e <= 65535)
    t = "u", i = 4;
  else if (e <= 4294967295)
    t = "U", i = 8;
  else
    throw new R("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + t + A.repeat("0", i - r.length) + r;
}
var In = 1, xe = 2;
function Fn(e) {
  this.schema = e.schema || Ot, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = A.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = Tn(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? xe : In, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function pt(e, r) {
  for (var t = A.repeat(" ", r), i = 0, n = -1, o = "", s, a = e.length; i < a; )
    n = e.indexOf(`
`, i), n === -1 ? (s = e.slice(i), i = a) : (s = e.slice(i, n + 1), i = n + 1), s.length && s !== `
` && (o += t), o += s;
  return o;
}
function qe(e, r) {
  return `
` + A.repeat(" ", e.indent * r);
}
function Pn(e, r) {
  var t, i, n;
  for (t = 0, i = e.implicitTypes.length; t < i; t += 1)
    if (n = e.implicitTypes[t], n.resolve(r))
      return !0;
  return !1;
}
function Me(e) {
  return e === mn || e === hn;
}
function we(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== Ze || 65536 <= e && e <= 1114111;
}
function dt(e) {
  return we(e) && e !== Ze && e !== fn && e !== ve;
}
function ht(e, r, t) {
  var i = dt(e), n = i && !Me(e);
  return (
    // ns-plain-safe
    (t ? (
      // c = flow-in
      i
    ) : i && e !== Vt && e !== Ht && e !== Bt && e !== jt && e !== $t) && e !== Ye && !(r === Pe && !n) || dt(r) && !Me(r) && e === Ye || r === Pe && n
  );
}
function Mn(e) {
  return we(e) && e !== Ze && !Me(e) && e !== Cn && e !== An && e !== Pe && e !== Vt && e !== Ht && e !== Bt && e !== jt && e !== $t && e !== Ye && e !== xn && e !== yn && e !== gn && e !== Ln && e !== _n && e !== Sn && e !== wn && e !== bn && e !== vn && e !== En && e !== kn;
}
function Un(e) {
  return !Me(e) && e !== Pe;
}
function ge(e, r) {
  var t = e.charCodeAt(r), i;
  return t >= 55296 && t <= 56319 && r + 1 < e.length && (i = e.charCodeAt(r + 1), i >= 56320 && i <= 57343) ? (t - 55296) * 1024 + i - 56320 + 65536 : t;
}
function zt(e) {
  var r = /^\n* /;
  return r.test(e);
}
var Yt = 1, We = 2, qt = 3, Wt = 4, se = 5;
function Dn(e, r, t, i, n, o, s, a) {
  var l, c = 0, d = null, p = !1, h = !1, f = i !== -1, b = -1, v = Mn(ge(e, 0)) && Un(ge(e, e.length - 1));
  if (r || s)
    for (l = 0; l < e.length; c >= 65536 ? l += 2 : l++) {
      if (c = ge(e, l), !we(c))
        return se;
      v = v && ht(c, d, a), d = c;
    }
  else {
    for (l = 0; l < e.length; c >= 65536 ? l += 2 : l++) {
      if (c = ge(e, l), c === ve)
        p = !0, f && (h = h || // Foldable line = too long, and not more-indented.
        l - b - 1 > i && e[b + 1] !== " ", b = l);
      else if (!we(c))
        return se;
      v = v && ht(c, d, a), d = c;
    }
    h = h || f && l - b - 1 > i && e[b + 1] !== " ";
  }
  return !p && !h ? v && !s && !n(e) ? Yt : o === xe ? se : We : t > 9 && zt(e) ? se : s ? o === xe ? se : We : h ? Wt : qt;
}
function Vn(e, r, t, i, n) {
  e.dump = function() {
    if (r.length === 0)
      return e.quotingType === xe ? '""' : "''";
    if (!e.noCompatMode && (On.indexOf(r) !== -1 || Rn.test(r)))
      return e.quotingType === xe ? '"' + r + '"' : "'" + r + "'";
    var o = e.indent * Math.max(1, t), s = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), a = i || e.flowLevel > -1 && t >= e.flowLevel;
    function l(c) {
      return Pn(e, c);
    }
    switch (Dn(
      r,
      a,
      e.indent,
      s,
      l,
      e.quotingType,
      e.forceQuotes && !i,
      n
    )) {
      case Yt:
        return r;
      case We:
        return "'" + r.replace(/'/g, "''") + "'";
      case qt:
        return "|" + ft(r, e.indent) + mt(pt(r, o));
      case Wt:
        return ">" + ft(r, e.indent) + mt(pt(Hn(r, s), o));
      case se:
        return '"' + Bn(r) + '"';
      default:
        throw new R("impossible error: invalid scalar style");
    }
  }();
}
function ft(e, r) {
  var t = zt(e) ? String(r) : "", i = e[e.length - 1] === `
`, n = i && (e[e.length - 2] === `
` || e === `
`), o = n ? "+" : i ? "" : "-";
  return t + o + `
`;
}
function mt(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function Hn(e, r) {
  for (var t = /(\n+)([^\n]*)/g, i = function() {
    var c = e.indexOf(`
`);
    return c = c !== -1 ? c : e.length, t.lastIndex = c, gt(e.slice(0, c), r);
  }(), n = e[0] === `
` || e[0] === " ", o, s; s = t.exec(e); ) {
    var a = s[1], l = s[2];
    o = l[0] === " ", i += a + (!n && !o && l !== "" ? `
` : "") + gt(l, r), n = o;
  }
  return i;
}
function gt(e, r) {
  if (e === "" || e[0] === " ") return e;
  for (var t = / [^ ]/g, i, n = 0, o, s = 0, a = 0, l = ""; i = t.exec(e); )
    a = i.index, a - n > r && (o = s > n ? s : a, l += `
` + e.slice(n, o), n = o + 1), s = a;
  return l += `
`, e.length - n > r && s > n ? l += e.slice(n, s) + `
` + e.slice(s + 1) : l += e.slice(n), l.slice(1);
}
function Bn(e) {
  for (var r = "", t = 0, i, n = 0; n < e.length; t >= 65536 ? n += 2 : n++)
    t = ge(e, n), i = k[t], !i && we(t) ? (r += e[n], t >= 65536 && (r += e[n + 1])) : r += i || Nn(t);
  return r;
}
function jn(e, r, t) {
  var i = "", n = e.tag, o, s, a;
  for (o = 0, s = t.length; o < s; o += 1)
    a = t[o], e.replacer && (a = e.replacer.call(t, String(o), a)), (H(e, r, a, !1, !1) || typeof a > "u" && H(e, r, null, !1, !1)) && (i !== "" && (i += "," + (e.condenseFlow ? "" : " ")), i += e.dump);
  e.tag = n, e.dump = "[" + i + "]";
}
function bt(e, r, t, i) {
  var n = "", o = e.tag, s, a, l;
  for (s = 0, a = t.length; s < a; s += 1)
    l = t[s], e.replacer && (l = e.replacer.call(t, String(s), l)), (H(e, r + 1, l, !0, !0, !1, !0) || typeof l > "u" && H(e, r + 1, null, !0, !0, !1, !0)) && ((!i || n !== "") && (n += qe(e, r)), e.dump && ve === e.dump.charCodeAt(0) ? n += "-" : n += "- ", n += e.dump);
  e.tag = o, e.dump = n || "[]";
}
function $n(e, r, t) {
  var i = "", n = e.tag, o = Object.keys(t), s, a, l, c, d;
  for (s = 0, a = o.length; s < a; s += 1)
    d = "", i !== "" && (d += ", "), e.condenseFlow && (d += '"'), l = o[s], c = t[l], e.replacer && (c = e.replacer.call(t, l, c)), H(e, r, l, !1, !1) && (e.dump.length > 1024 && (d += "? "), d += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), H(e, r, c, !1, !1) && (d += e.dump, i += d));
  e.tag = n, e.dump = "{" + i + "}";
}
function zn(e, r, t, i) {
  var n = "", o = e.tag, s = Object.keys(t), a, l, c, d, p, h;
  if (e.sortKeys === !0)
    s.sort();
  else if (typeof e.sortKeys == "function")
    s.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new R("sortKeys must be a boolean or a function");
  for (a = 0, l = s.length; a < l; a += 1)
    h = "", (!i || n !== "") && (h += qe(e, r)), c = s[a], d = t[c], e.replacer && (d = e.replacer.call(t, c, d)), H(e, r + 1, c, !0, !0, !0) && (p = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, p && (e.dump && ve === e.dump.charCodeAt(0) ? h += "?" : h += "? "), h += e.dump, p && (h += qe(e, r)), H(e, r + 1, d, !0, p) && (e.dump && ve === e.dump.charCodeAt(0) ? h += ":" : h += ": ", h += e.dump, n += h));
  e.tag = o, e.dump = n || "{}";
}
function vt(e, r, t) {
  var i, n, o, s, a, l;
  for (n = t ? e.explicitTypes : e.implicitTypes, o = 0, s = n.length; o < s; o += 1)
    if (a = n[o], (a.instanceOf || a.predicate) && (!a.instanceOf || typeof r == "object" && r instanceof a.instanceOf) && (!a.predicate || a.predicate(r))) {
      if (t ? a.multi && a.representName ? e.tag = a.representName(r) : e.tag = a.tag : e.tag = "?", a.represent) {
        if (l = e.styleMap[a.tag] || a.defaultStyle, Ut.call(a.represent) === "[object Function]")
          i = a.represent(r, l);
        else if (Dt.call(a.represent, l))
          i = a.represent[l](r, l);
        else
          throw new R("!<" + a.tag + '> tag resolver accepts not "' + l + '" style');
        e.dump = i;
      }
      return !0;
    }
  return !1;
}
function H(e, r, t, i, n, o, s) {
  e.tag = null, e.dump = t, vt(e, t, !1) || vt(e, t, !0);
  var a = Ut.call(e.dump), l = i, c;
  i && (i = e.flowLevel < 0 || e.flowLevel > r);
  var d = a === "[object Object]" || a === "[object Array]", p, h;
  if (d && (p = e.duplicates.indexOf(t), h = p !== -1), (e.tag !== null && e.tag !== "?" || h || e.indent !== 2 && r > 0) && (n = !1), h && e.usedDuplicates[p])
    e.dump = "*ref_" + p;
  else {
    if (d && h && !e.usedDuplicates[p] && (e.usedDuplicates[p] = !0), a === "[object Object]")
      i && Object.keys(e.dump).length !== 0 ? (zn(e, r, e.dump, n), h && (e.dump = "&ref_" + p + e.dump)) : ($n(e, r, e.dump), h && (e.dump = "&ref_" + p + " " + e.dump));
    else if (a === "[object Array]")
      i && e.dump.length !== 0 ? (e.noArrayIndent && !s && r > 0 ? bt(e, r - 1, e.dump, n) : bt(e, r, e.dump, n), h && (e.dump = "&ref_" + p + e.dump)) : (jn(e, r, e.dump), h && (e.dump = "&ref_" + p + " " + e.dump));
    else if (a === "[object String]")
      e.tag !== "?" && Vn(e, e.dump, r, o, l);
    else {
      if (a === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new R("unacceptable kind of an object to dump " + a);
    }
    e.tag !== null && e.tag !== "?" && (c = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? c = "!" + c : c.slice(0, 18) === "tag:yaml.org,2002:" ? c = "!!" + c.slice(18) : c = "!<" + c + ">", e.dump = c + " " + e.dump);
  }
  return !0;
}
function Yn(e, r) {
  var t = [], i = [], n, o;
  for (Ge(e, t, i), n = 0, o = i.length; n < o; n += 1)
    r.duplicates.push(t[i[n]]);
  r.usedDuplicates = new Array(o);
}
function Ge(e, r, t) {
  var i, n, o;
  if (e !== null && typeof e == "object")
    if (n = r.indexOf(e), n !== -1)
      t.indexOf(n) === -1 && t.push(n);
    else if (r.push(e), Array.isArray(e))
      for (n = 0, o = e.length; n < o; n += 1)
        Ge(e[n], r, t);
    else
      for (i = Object.keys(e), n = 0, o = i.length; n < o; n += 1)
        Ge(e[i[n]], r, t);
}
function qn(e, r) {
  r = r || {};
  var t = new Fn(r);
  t.noRefs || Yn(e, t);
  var i = e;
  return t.replacer && (i = t.replacer.call({ "": i }, "", i)), H(t, 0, i, !0, !0) ? t.dump + `
` : "";
}
var Wn = qn, Gn = {
  dump: Wn
}, Gt = dn.load, Kn = Gn.dump;
const Re = {
  BACKEND: "https://url.v1.mk",
  CHUNK_COUNT: "20"
};
function Jn(e, r = 10) {
  const t = [];
  let i = [];
  return e.forEach((n, o) => {
    i.push(n), (o + 1) % r === 0 && (t.push(i.join("|")), i = []);
  }), i.length > 0 && t.push(i.join("|")), t;
}
const xt = {
  retries: 0,
  retryDelay: 1e3,
  maxRetryDelay: 3e4,
  timeout: 1e4,
  retryOn: [408, 429, 500, 502, 503, 504],
  exponentialBackoff: !0,
  jitter: 0.1
};
class Te extends Error {
  constructor(r, t, i, n) {
    super(r), this.message = r, this.status = t, this.response = i, this.attempt = n, this.name = "FetchRetryError";
  }
}
const wt = 30;
function yt(e, r) {
  let t = r.retryDelay;
  if (r.exponentialBackoff && (t = t * 2 ** (e - 1)), r.jitter > 0) {
    const i = r.jitter * Math.random();
    t = t * (1 + i);
  }
  return Math.min(t, r.maxRetryDelay);
}
function Qn(e) {
  return new Promise((r, t) => {
    setTimeout(() => {
      t(new Te(`请求超时 (${e}ms)`));
    }, e);
  });
}
async function et(e, r = {}) {
  const t = {
    ...xt,
    ...r,
    // 确保重试次数不超过最大限制
    retries: r.retries === 1 / 0 ? wt : Math.min(r.retries || xt.retries || 0, wt)
  };
  let i = 0;
  const n = async () => {
    i++;
    try {
      let o, s;
      if (e instanceof Request) {
        s = e.url;
        const p = e.clone();
        o = new Request(p, {
          ...p,
          ...r
        });
      } else
        s = e.toString(), o = new Request(s, r);
      const a = fetch(o), l = t.timeout ? Qn(t.timeout) : null, c = await (l ? Promise.race([a, l]) : a), d = {
        status: c.status,
        statusText: c.statusText,
        headers: Object.fromEntries(c.headers.entries()),
        data: c,
        config: { url: s, ...r },
        ok: c.ok
      };
      if (t.retries > 0 && i <= t.retries && (typeof t.retryOn == "function" ? t.retryOn(c) : t.retryOn.includes(c.status))) {
        const p = yt(i, t);
        if (t.onRetry && await t.onRetry(i, p), t.onError) {
          const h = new Te(`请求失败，状态码 ${d.status}`, d.status, c, i);
          await t.onError(h, i);
        }
        return await new Promise((h) => setTimeout(h, p)), n();
      }
      return d;
    } catch (o) {
      const s = o instanceof Te ? o : new Te(o.message || "请求失败", void 0, void 0, i);
      if (t.onError && await t.onError(s, i), t.retries > 0 && i <= t.retries) {
        const a = yt(i, t);
        return t.onRetry && await t.onRetry(i, a), await new Promise((l) => setTimeout(l, a)), n();
      }
      throw s;
    }
  };
  return n();
}
function Kt(e) {
  if (!e) return e;
  const r = atob(e), t = new Uint8Array(r.length);
  for (let i = 0; i < r.length; i++)
    t[i] = r.charCodeAt(i);
  return new TextDecoder().decode(t);
}
function Ke(e) {
  if (!e) return e;
  const r = new TextEncoder().encode(e.trim());
  let t = "";
  for (let i = 0; i < r.length; i += 1)
    t += String.fromCharCode(r[i]);
  return btoa(t);
}
function Xn(e, r) {
  const t = (i) => i;
  try {
    return e ? Ke(e.toString()) : t(e);
  } catch {
    return t(e);
  }
}
class Zn {
  constructor(r = []) {
    _(this, "existVps", []);
    _(this, "existVpsMap", /* @__PURE__ */ new Map());
    this.existVps = r, this.updateExist(this.existVps);
  }
  updateExist(r = []) {
    for (const t of r) {
      const i = this.getParser(t);
      i && this.setExistVpsMap(i);
    }
  }
  updateVpsPs(r) {
    const t = this.getParser(r);
    if (!t) return null;
    const i = t.originPs, [n, o] = i.split("#");
    if (!o) return r;
    const s = this.existVpsMap.get(o) || 0, a = s === 0 ? i : `${n}#${o} ${s}`;
    return t.updateOriginConfig(a), this.existVpsMap.set(o, s + 1), t.originLink;
  }
  setExistVpsMap(r) {
    const t = r.originPs, [, i] = t.split("#");
    if (!i) return;
    const [n, o] = i.split(" "), s = o ? Number.parseInt(o) >>> 0 : 0, a = this.existVpsMap.get(n) || 0;
    this.existVpsMap.set(n, Math.max(a, s + 1));
  }
  getParser(r) {
    return r.startsWith("vless://") ? new Zt(r) : r.startsWith("vmess://") ? new er(r) : r.startsWith("trojan://") ? new Xt(r) : r.startsWith("ss://") ? new Qt(r) : r.startsWith("hysteria2://") || r.startsWith("hysteria://") || r.startsWith("hy2://") ? new Jt(r) : null;
  }
}
class eo extends Zn {
  constructor(r = []) {
    super(r);
  }
}
var ye, Ce, _e, Ue;
class Oe {
  constructor() {
    x(this, ye, ["localhost", "127.0.0.1", "abc.cba.com"]);
    x(this, Ce, ["AES_256_GCM", "CHACHA20_POLY1305", "AES_128_GCM", "CHACHA20_IETF"]);
    x(this, _e, 1024);
    x(this, Ue, 65535);
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
    return Math.floor(Math.random() * (u(this, Ue) - u(this, _e) + 1) + u(this, _e)).toString();
  }
  /**
   * @description 获取随机 SS协议的加密类型
   */
  getEncrtptionProtocol() {
    return u(this, Ce)[Math.floor(Math.random() * u(this, Ce).length)];
  }
}
ye = new WeakMap(), Ce = new WeakMap(), _e = new WeakMap(), Ue = new WeakMap();
var W, G;
const N = class N {
  /**
   * @description 获取备注
   * @param {string} name
   * @returns {[string, string]} [origin, confuse]
   */
  static getPs(r) {
    const t = r.split(u(N, W));
    return [t[0], t[1]];
  }
  /**
   * @description 设置备注
   * @param {string} name 原始备注
   * @param {string} ps 混淆备注
   * @returns {string} origin^LINK_TO^confuse
   */
  static setPs(r, t) {
    return [r, t].join(u(N, W));
  }
  /**
   * @description 获取前缀（带缓存）
   * @param {string} name
   * @returns {string|null} prefix
   */
  static getPrefix(r) {
    if (!(r != null && r.includes(u(N, W)))) return null;
    if (u(N, G).has(r))
      return u(N, G).get(r);
    const [t] = N.getPs(r);
    if (t) {
      const i = t.trim();
      return u(N, G).set(r, i), i;
    }
    return null;
  }
  static isConfigType(r) {
    return r.includes(u(this, W));
  }
  // 清除缓存
  static clearCache() {
    u(this, G).clear();
  }
};
W = new WeakMap(), G = new WeakMap(), x(N, W, "^LINK_TO^"), x(N, G, /* @__PURE__ */ new Map());
let L = N;
var K, Se, B, I, J, ce;
class Jt extends Oe {
  constructor(t) {
    super();
    /** * @description 原始链接 */
    x(this, K, "");
    /** * @description 混淆链接 */
    x(this, Se, "");
    /** * @description vps原始配置 */
    x(this, B, {});
    /** * @description 混淆配置 */
    x(this, I, {});
    /** * @description 原始备注 */
    x(this, J, "");
    /** * @description 混淆备注 */
    x(this, ce, "");
    g(this, ce, crypto.randomUUID()), this.setOriginConfig(t), this.setConfuseConfig(t);
  }
  /**
   * @description 设置原始配置
   * @param {string} v
   */
  setOriginConfig(t) {
    g(this, K, t), g(this, B, new URL(t)), g(this, J, u(this, B).hash ?? "");
  }
  /**
   * @description 更新原始配置
   * @param {string} ps
   */
  updateOriginConfig(t) {
    u(this, B).hash = t, g(this, J, t), g(this, K, u(this, B).href), this.setConfuseConfig(u(this, K));
  }
  /**
   * @description 设置混淆配置
   * @param {string} v
   */
  setConfuseConfig(t) {
    g(this, I, new URL(t)), u(this, I).username = this.getUsername(), u(this, I).host = this.getHost(), u(this, I).hostname = this.getHostName(), u(this, I).port = this.getPort(), u(this, I).hash = L.setPs(u(this, J), u(this, ce)), g(this, Se, u(this, I).href);
  }
  restoreClash(t, i) {
    var n;
    return t.name = i, t.server = this.originConfig.hostname ?? "", t.port = Number(this.originConfig.port ?? 0), t.password = ((n = this.originConfig) == null ? void 0 : n.username) ?? "", t;
  }
  restoreSingbox(t, i) {
    var n;
    return t.password = ((n = this.originConfig) == null ? void 0 : n.username) ?? "", t.server = this.originConfig.hostname ?? "", t.server_port = Number(this.originConfig.port ?? 0), t.tag = i, t;
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
    return u(this, B);
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
K = new WeakMap(), Se = new WeakMap(), B = new WeakMap(), I = new WeakMap(), J = new WeakMap(), ce = new WeakMap();
var Q, Ae, j, F, X, ue;
class Qt extends Oe {
  constructor(t) {
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
    g(this, ue, crypto.randomUUID()), this.setOriginConfig(t), this.setConfuseConfig(t);
  }
  /**
   * @description 设置原始配置
   * @param {string} v
   */
  setOriginConfig(t) {
    g(this, Q, t), g(this, j, new URL(t)), g(this, X, u(this, j).hash ?? "");
  }
  /**
   * @description 更新原始配置
   * @param {string} ps
   */
  updateOriginConfig(t) {
    u(this, j).hash = t, g(this, X, t), g(this, Q, u(this, j).href), this.setConfuseConfig(u(this, Q));
  }
  /**
   * @description 设置混淆配置
   * @param {string} v
   */
  setConfuseConfig(t) {
    g(this, F, new URL(t)), u(this, F).username = this.getUsername(), u(this, F).host = this.getHost(), u(this, F).hostname = this.getHostName(), u(this, F).port = this.getPort(), u(this, F).hash = L.setPs(u(this, X), u(this, ue)), g(this, Ae, u(this, F).href);
  }
  restoreClash(t, i) {
    var n;
    return t.name = i, t.server = this.originConfig.hostname ?? "", t.port = Number(((n = this.originConfig) == null ? void 0 : n.port) ?? 0), t;
  }
  restoreSingbox(t, i) {
    return t.server = this.originConfig.hostname ?? "", t.server_port = Number(this.originConfig.port ?? 0), t.tag = i, t;
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
class Xt extends Oe {
  constructor(t) {
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
    g(this, pe, crypto.randomUUID()), this.setOriginConfig(t), this.setConfuseConfig(t);
  }
  /**
   * @description 设置原始配置
   * @param {string} v
   */
  setOriginConfig(t) {
    g(this, Z, t), g(this, $, new URL(t)), g(this, ee, u(this, $).hash ?? "");
  }
  /**
   * @description 更新原始配置
   * @param {string} ps
   */
  updateOriginConfig(t) {
    u(this, $).hash = t, g(this, ee, t), g(this, Z, u(this, $).href), this.setConfuseConfig(u(this, Z));
  }
  /**
   * @description 设置混淆配置
   * @param {string} v
   */
  setConfuseConfig(t) {
    g(this, P, new URL(t)), u(this, P).username = this.getUsername(), u(this, P).host = this.getHost(), u(this, P).hostname = this.getHostName(), u(this, P).port = this.getPort(), u(this, P).hash = L.setPs(u(this, ee), u(this, pe)), g(this, Ee, u(this, P).href);
  }
  restoreClash(t, i) {
    var n;
    return t.name = i, t.server = this.originConfig.hostname ?? "", t.port = Number(this.originConfig.port ?? 0), t.password = ((n = this.originConfig) == null ? void 0 : n.username) ?? "", t.alpn = t.alpn ? t.alpn.map((o) => decodeURIComponent(o)) : t.alpn, t;
  }
  restoreSingbox(t, i) {
    var n, o, s;
    return t.password = ((n = this.originConfig) == null ? void 0 : n.username) ?? "", t.server = this.originConfig.hostname ?? "", t.server_port = Number(this.originConfig.port ?? 0), t.tag = i, (o = t.tls) != null && o.server_name && (t.tls.server_name = this.originConfig.hostname ?? ""), (s = t.tls) != null && s.alpn && (t.tls.alpn = t.tls.alpn.map((a) => decodeURIComponent(a))), t;
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
class Zt extends Oe {
  constructor(t) {
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
    g(this, de, crypto.randomUUID()), this.setOriginConfig(t), this.setConfuseConfig(t);
  }
  /**
   * @description 设置原始配置
   * @param {string} v
   */
  setOriginConfig(t) {
    g(this, te, t), g(this, z, new URL(t)), g(this, re, u(this, z).hash ?? "");
  }
  /**
   * @description 更新原始配置
   * @param {string} ps
   */
  updateOriginConfig(t) {
    u(this, z).hash = t, g(this, re, t), g(this, te, u(this, z).href), this.setConfuseConfig(u(this, te));
  }
  /**
   * @description 设置混淆配置
   * @param {string} v
   */
  setConfuseConfig(t) {
    g(this, M, new URL(t)), u(this, M).username = this.getUsername(), u(this, M).host = this.getHost(), u(this, M).hostname = this.getHostName(), u(this, M).port = this.getPort(), u(this, M).hash = L.setPs(u(this, re), u(this, de)), g(this, ke, u(this, M).href);
  }
  restoreClash(t, i) {
    var n, o;
    return t.name = i, t.server = this.originConfig.hostname ?? "", t.port = Number(((n = this.originConfig) == null ? void 0 : n.port) ?? 0), t.uuid = this.originConfig.username ?? "", t.alpn = t.alpn ? (o = t.alpn) == null ? void 0 : o.map((s) => decodeURIComponent(s)) : t.alpn, t;
  }
  restoreSingbox(t, i) {
    var n, o;
    return t.tag = i, t.server = this.originConfig.hostname ?? "", t.server_port = Number(this.originConfig.port ?? 0), t.uuid = this.originConfig.username ?? "", (n = t.tls) != null && n.server_name && (t.tls.server_name = this.originConfig.hostname ?? ""), (o = t.tls) != null && o.alpn && (t.tls.alpn = t.tls.alpn.map((s) => decodeURIComponent(s))), t;
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
var he, Le, V, U, ie, fe, De, tr;
class er extends Oe {
  constructor(t) {
    super();
    x(this, De);
    /** * @description 原始链接 */
    x(this, he, "");
    /** * @description 混淆链接 */
    x(this, Le, "");
    /** * @description vps原始配置 */
    x(this, V, {});
    /** * @description 混淆配置 */
    x(this, U, {});
    /** * @description 原始备注 */
    x(this, ie, "");
    /** * @description 混淆备注 */
    x(this, fe, "");
    g(this, fe, crypto.randomUUID()), this.setOriginConfig(t), this.setConfuseConfig();
  }
  /**
   * @description 设置原始配置
   * @param {string} v
   */
  setOriginConfig(t) {
    const [i, n] = t.match(/vmess:\/\/(.*)/) || [];
    g(this, he, t), g(this, V, JSON.parse(Kt(n))), g(this, ie, u(this, V).ps ?? "");
  }
  /**
   * @description 更新原始配置
   * @param {string} ps
   */
  updateOriginConfig(t) {
    u(this, V).ps = t, g(this, ie, t), g(this, he, `vmess://${Ke(JSON.stringify(u(this, V)))}`), this.setConfuseConfig();
  }
  /**
   * @description 设置混淆配置
   */
  setConfuseConfig() {
    g(this, U, structuredClone(u(this, V))), u(this, U).add = this.getHostName(), u(this, U).port = this.getPort(), u(this, U).id = this.getPassword(), u(this, U).ps = L.setPs(u(this, ie), u(this, fe)), g(this, Le, `vmess://${Ke(JSON.stringify(u(this, U)))}`);
  }
  restoreClash(t, i) {
    var n, o;
    return rt(this, De, tr).call(this, t), t.name = i, t.server = this.originConfig.add ?? "", t.port = Number(((n = this.originConfig) == null ? void 0 : n.port) ?? 0), t.uuid = ((o = this.originConfig) == null ? void 0 : o.id) ?? "", t;
  }
  restoreSingbox(t, i) {
    var n, o;
    return t.server = this.originConfig.add ?? "", t.server_port = Number(this.originConfig.port ?? 0), t.tag = i, (n = t.tls) != null && n.server_name && (t.tls.server_name = this.originConfig.add ?? ""), t.uuid = ((o = this.originConfig) == null ? void 0 : o.id) ?? "", t;
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
    return u(this, V);
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
    return u(this, U);
  }
}
he = new WeakMap(), Le = new WeakMap(), V = new WeakMap(), U = new WeakMap(), ie = new WeakMap(), fe = new WeakMap(), De = new WeakSet(), tr = function(t) {
  t.network === "ws" && (t["ws-opts"] = {
    ...t["ws-opts"],
    path: this.originConfig.path,
    headers: {
      ...t["ws-opts"].headers,
      Host: this.originConfig.host
    }
  });
};
class rr extends eo {
  constructor(t, i = [], n = "") {
    super(i);
    _(this, "urlSet", /* @__PURE__ */ new Set());
    _(this, "vpsStore", /* @__PURE__ */ new Map());
    _(this, "originUrls", /* @__PURE__ */ new Set());
    _(this, "vps", []);
    _(this, "includeProtocol", []);
    this.vps = t, this.includeProtocol = n ? JSON.parse(n) : [];
  }
  async parse(t = this.vps) {
    for await (const i of t) {
      const n = this.updateVpsPs(i);
      if (n) {
        let o = null;
        n.startsWith("vless://") && this.hasProtocol("vless") ? o = new Zt(n) : n.startsWith("vmess://") && this.hasProtocol("vmess") ? o = new er(n) : n.startsWith("trojan://") && this.hasProtocol("trojan") ? o = new Xt(n) : n.startsWith("ss://") && this.hasProtocol("shadowsocks", "shadowsocksr") ? o = new Qt(n) : this.isHysteria2(n) && this.hasProtocol("hysteria", "hysteria2", "hy2") && (o = new Jt(n)), o && this.setStore(n, o);
      }
      if (i.startsWith("https://") || i.startsWith("http://")) {
        const o = await et(i, { retries: 3 }).then((l) => l.data.text()), { subType: s, content: a } = this.getSubType(o);
        s === "base64" && o && (this.updateExist(Array.from(this.originUrls)), await this.parse(a.split(`
`).filter(Boolean)));
      }
    }
  }
  setStore(t, i) {
    this.urlSet.add(i.confuseLink), this.originUrls.add(t), this.vpsStore.set(i.confusePs, i);
  }
  getSubType(t) {
    try {
      return {
        subType: "base64",
        content: Kt(t)
      };
    } catch {
      try {
        return {
          subType: "yaml",
          content: Gt(t)
        };
      } catch {
        try {
          const i = JSON.parse(t);
          return {
            subType: "json",
            content: JSON.stringify(i)
          };
        } catch {
          return {
            subType: "unknown",
            content: t
          };
        }
      }
    }
  }
  isHysteria2(t) {
    return t.startsWith("hysteria2://") || t.startsWith("hysteria://") || t.startsWith("hy2://");
  }
  hasProtocol(...t) {
    return this.includeProtocol.length === 0 || t.some((i) => this.includeProtocol.includes(i));
  }
  get urls() {
    return Array.from(this.urlSet);
  }
  get vpsMap() {
    return this.vpsStore;
  }
  get originVps() {
    return Array.from(this.originUrls);
  }
}
let to = class {
  async getConfig(r) {
    try {
      const i = (await Promise.all(r.map((n) => et(n, { retries: 3 }).then((o) => o.data.text())))).map((n) => Gt(n));
      return this.mergeClashConfig(i);
    } catch (t) {
      throw new Error(`Failed to get clash config: ${t.message || t}`);
    }
  }
  /**
   * @description 合并配置
   * @param {ClashType[]} configs
   * @returns {ClashType} mergedConfig
   */
  mergeClashConfig(r = []) {
    var t, i, n, o;
    try {
      if (!r.length)
        return {};
      const s = structuredClone(r[0]);
      if (r.length === 1)
        return s;
      const a = {
        ...s,
        proxies: s.proxies || [],
        "proxy-groups": s["proxy-groups"] || []
      }, l = r.reduce((f, b) => {
        var v;
        return f + (((v = b.proxies) == null ? void 0 : v.length) || 0);
      }, 0), c = new Int32Array(l), d = new Set((t = s.proxies) == null ? void 0 : t.map((f) => f.name));
      let p = ((i = s.proxies) == null ? void 0 : i.length) || 0;
      const h = new Map(a["proxy-groups"].map((f) => [f.name, f]));
      for (let f = 1; f < r.length; f++) {
        const b = r[f];
        if ((n = b.proxies) != null && n.length)
          for (const v of b.proxies)
            d.has(v.name) || (a.proxies[p] = v, c[p] = p, d.add(v.name), p++);
        if ((o = b["proxy-groups"]) != null && o.length)
          for (const v of b["proxy-groups"]) {
            const y = h.get(v.name);
            if (y) {
              const O = new Set(y.proxies);
              for (const w of v.proxies || [])
                O.add(w);
              y.proxies = Array.from(O), Object.assign(y, {
                ...v,
                proxies: y.proxies
              });
            } else
              a["proxy-groups"].push(v), h.set(v.name, v);
          }
      }
      return a.proxies = a.proxies.filter((f, b) => c[b] !== -1), a;
    } catch (s) {
      throw new Error(`Failed to merge clash config: ${s.message || s}`);
    }
  }
}, ro = class {
  async getConfig(r) {
    try {
      const t = await Promise.all(
        r.map((i) => et(i, { retries: 3 }).then((n) => n.data.json()))
      );
      return this.mergeConfig(t);
    } catch (t) {
      throw new Error(`Failed to get singbox config: ${t.message || t}`);
    }
  }
  mergeConfig(r) {
    var t, i;
    try {
      if (r.length === 0)
        return {};
      const n = structuredClone(r[0]), o = [], s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map();
      for (const l of r)
        if ((t = l.outbounds) != null && t.length) {
          for (const c of l.outbounds)
            if (c.outbounds) {
              const d = `${c.type}:${c.tag}`;
              if (!a.has(d)) {
                const p = new Set(c.outbounds.filter((h) => !L.isConfigType(h)));
                a.set(d, {
                  base: c,
                  baseOutbounds: p,
                  linkOutbounds: /* @__PURE__ */ new Set()
                });
              }
              c.outbounds.forEach((p) => {
                var h;
                L.isConfigType(p) && ((h = a.get(d)) == null || h.linkOutbounds.add(p));
              });
            }
        }
      for (const l of r)
        if ((i = l.outbounds) != null && i.length) {
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
      return n.outbounds = o, n;
    } catch (n) {
      throw new Error(`Failed to merge singbox config: ${n.message || n}`);
    }
  }
}, io = class extends rr {
  async getConfig(r, t) {
    try {
      return await this.parse(t), Xn(this.originVps.join(`
`));
    } catch (i) {
      throw new Error(`Failed to get v2ray config: ${i.message || i}`);
    }
  }
};
class no {
  constructor(r) {
    _(this, "urls", []);
    _(this, "vps", []);
    _(this, "chunkCount", Number(Re.CHUNK_COUNT));
    _(this, "backend", Re.BACKEND);
    _(this, "parser", null);
    _(this, "clashClient", new to());
    _(this, "singboxClient", new ro());
    _(this, "v2rayClient", new io(this.vps));
    this.chunkCount = Number(r.CHUNK_COUNT ?? Re.CHUNK_COUNT), this.backend = r.BACKEND ?? Re.BACKEND, this.parser = null;
  }
  async setSubUrls(r) {
    const { searchParams: t } = new URL(r.url), i = t.get("url"), n = t.get("protocol"), o = i.split(/\||\n/).filter(Boolean);
    this.parser = new rr(o, [], n), this.vps = o, await this.parser.parse(o);
    const s = Jn(Array.from(this.parser.urls), Number(this.chunkCount));
    this.urls = s.map((a) => {
      const l = new URL(`${this.backend}/sub`), { searchParams: c } = new URL(r.url);
      return c.set("url", a), l.search = c.toString(), l.toString();
    });
  }
  async getClashConfig() {
    return await this.clashClient.getConfig(this.urls);
  }
  async getSingboxConfig() {
    return await this.singboxClient.getConfig(this.urls);
  }
  async getV2RayConfig() {
    return await this.v2rayClient.getConfig(this.urls, this.vps);
  }
  get vpsStore() {
    var r;
    return (r = this.parser) == null ? void 0 : r.vpsMap;
  }
}
class oo {
  constructor(r) {
    _(this, "confuseConfig");
    this.confuseConfig = r;
  }
  getOriginConfig(r) {
    var t, i;
    try {
      return this.confuseConfig.proxies = this.restoreProxies(this.confuseConfig.proxies, r), this.confuseConfig["proxy-groups"] = (i = (t = this.confuseConfig) == null ? void 0 : t["proxy-groups"]) == null ? void 0 : i.map((n) => (n.proxies && (n.proxies = this.updateProxiesGroups(n.proxies)), n)), this.confuseConfig;
    } catch (n) {
      throw new Error(`Get origin config failed: ${n.message || n}, function trace: ${n.stack}`);
    }
  }
  restoreProxies(r, t) {
    try {
      if (!r)
        return [];
      const i = [];
      for (const n of r) {
        const [o, s] = L.getPs(n.name);
        if (t.has(s)) {
          const a = t.get(s);
          a == null || a.restoreClash(n, o), i.push(n);
        }
      }
      return i;
    } catch (i) {
      throw new Error(`Restore proxies failed: ${i.message || i}, function trace: ${i.stack}`);
    }
  }
  updateProxiesGroups(r) {
    try {
      return r.map((t) => {
        const [i] = L.getPs(t);
        return i;
      });
    } catch (t) {
      throw new Error(`Update proxies groups failed: ${t.message || t}, function trace: ${t.stack}`);
    }
  }
}
class so {
  constructor(r) {
    _(this, "confuseConfig");
    this.confuseConfig = r;
  }
  getOriginConfig(r) {
    try {
      return this.confuseConfig.outbounds = this.restoreOutbounds(this.confuseConfig.outbounds, r), this.confuseConfig;
    } catch (t) {
      throw new Error(`Get origin config failed: ${t.message || t}, function trace: ${t.stack}`);
    }
  }
  restoreOutbounds(r = [], t) {
    try {
      const i = [];
      for (const n of r) {
        if (this.isConfuseVps(n.tag)) {
          const [o, s] = L.getPs(n.tag), a = t.get(s);
          a == null || a.restoreSingbox(n, o);
        }
        Reflect.has(n, "outbounds") && (n.outbounds = this.updateOutbouns(n.outbounds)), i.push(n);
      }
      return i;
    } catch (i) {
      throw new Error(`Restore outbounds failed: ${i.message || i}, function trace: ${i.stack}`);
    }
  }
  updateOutbouns(r = []) {
    try {
      return r.map((t) => {
        if (this.isConfuseVps(t)) {
          const [i] = L.getPs(t);
          return i;
        }
        return t;
      });
    } catch (t) {
      throw new Error(`Update outbounds failed: ${t.message || t}, function trace: ${t.stack}`);
    }
  }
  isConfuseVps(r) {
    return L.isConfigType(r);
  }
}
class ao {
  constructor(r) {
    _(this, "confuseConfig");
    this.confuseConfig = r;
  }
  getOriginConfig() {
    try {
      return this.confuseConfig;
    } catch (r) {
      throw new Error(`Get origin config failed: ${r.message || r}, function trace: ${r.stack}`);
    }
  }
}
class lo {
  constructor(r) {
    this.confuse = r, this.confuse = r;
  }
  async getClashConfig() {
    const r = await this.confuse.getClashConfig();
    return new oo(r).getOriginConfig(this.confuse.vpsStore);
  }
  async getSingboxConfig() {
    const r = await this.confuse.getSingboxConfig();
    return new so(r).getOriginConfig(this.confuse.vpsStore);
  }
  async getV2RayConfig() {
    const r = await this.confuse.getV2RayConfig();
    return new ao(r).getOriginConfig();
  }
}
class co {
  constructor(r) {
    this.db = r;
  }
  async toSub(r, t, i) {
    try {
      const n = new no(t);
      await n.setSubUrls(r);
      const o = new lo(n);
      if (["clash", "clashr"].includes(i)) {
        const s = await o.getClashConfig();
        return new Response(Kn(s, { indent: 2, lineWidth: 200 }), {
          headers: new Headers({
            "Content-Type": "text/yaml; charset=UTF-8",
            "Cache-Control": "no-store"
          })
        });
      }
      if (i === "singbox") {
        const s = await o.getSingboxConfig();
        return new Response(JSON.stringify(s), {
          headers: new Headers({
            "Content-Type": "text/plain; charset=UTF-8",
            "Cache-Control": "no-store"
          })
        });
      }
      if (i === "v2ray") {
        const s = await o.getV2RayConfig();
        return new Response(s, {
          headers: new Headers({
            "Content-Type": "text/plain; charset=UTF-8",
            "Cache-Control": "no-store"
          })
        });
      }
      return C.error("Unsupported client type, support list: clash, singbox, v2ray");
    } catch (n) {
      throw new Error(n.message || "Invalid request");
    }
  }
  async add(r, t) {
    if (!this.db)
      throw new Error("Database is not initialized");
    const i = this.generateShortCode(), n = `${t}/${i}`, o = await this.db.prepare("INSERT INTO short_url (short_code, short_url, long_url) VALUES (?, ?, ?) RETURNING id").bind(i, n, r).first();
    if (!(o != null && o.id))
      throw new Error("Failed to create short URL");
    return { id: o.id, short_code: i, short_url: n, long_url: r };
  }
  async delete(r) {
    if (!this.db)
      throw new Error("Database is not initialized");
    await this.db.prepare("DELETE FROM short_url WHERE id = ?").bind(r).run();
  }
  async getById(r) {
    if (!this.db)
      throw new Error("Database is not initialized");
    return await this.db.prepare("SELECT id, short_url, long_url FROM short_url WHERE id = ?").bind(r).first();
  }
  async getList(r = 1, t = 10) {
    if (!this.db)
      throw new Error("Database is not initialized");
    const i = (r - 1) * t, [n, o] = await Promise.all([
      this.db.prepare("SELECT COUNT(*) as count FROM short_url").first(),
      this.db.prepare("SELECT id, short_code, short_url, long_url FROM short_url LIMIT ? OFFSET ?").bind(t, i).all()
    ]);
    return {
      total: (n == null ? void 0 : n.count) || 0,
      items: (o == null ? void 0 : o.results) || []
    };
  }
  async getByShortUrl(r) {
    if (!this.db)
      throw new Error("Database is not initialized");
    return await this.db.prepare("SELECT id, short_code, short_url, long_url FROM short_url WHERE short_url = ?").bind(r).first();
  }
  async getByCode(r) {
    if (!this.db)
      throw new Error("Database is not initialized");
    return await this.db.prepare("SELECT id, short_code, short_url, long_url FROM short_url WHERE short_code = ?").bind(r).first();
  }
  async deleteByCode(r) {
    if (!this.db)
      throw new Error("Database is not initialized");
    await this.db.prepare("DELETE FROM short_url WHERE short_code = ?").bind(r).run();
  }
  generateShortCode() {
    return crypto.randomUUID().substring(0, 8);
  }
}
const Ct = new sr(), mo = {
  async fetch(e, r) {
    try {
      if (e.method === "OPTIONS")
        return C.cors(new Response(null, { status: 200 }));
      const t = new co(r.DB), i = new or(t);
      Ct.get("/", (o) => Ar(o, r)).get("/favicon.ico", () => new Response(null, { status: 200 })).get("/sub", (o) => i.toSub(o, r)).post("/api/add", (o) => i.add(o)).delete("/api/delete", (o) => i.delete(o)).get("/api/queryByCode", (o) => i.queryByCode(o)).get("/api/queryList", (o) => i.queryList(o)).get("/:code", (o) => i.redirect(o));
      const n = await Ct.handle(e, r);
      return C.cors(n);
    } catch (t) {
      return C.error(t.message || t);
    }
  }
};
export {
  mo as default
};
