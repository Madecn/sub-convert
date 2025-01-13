var Xt = Object.defineProperty;
var tt = (e) => {
  throw TypeError(e);
};
var Zt = (e, r, t) => r in e ? Xt(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t;
var A = (e, r, t) => Zt(e, typeof r != "symbol" ? r + "" : r, t), He = (e, r, t) => r.has(e) || tt("Cannot " + t);
var c = (e, r, t) => (He(e, r, "read from private field"), t ? t.call(e) : r.get(e)), x = (e, r, t) => r.has(e) ? tt("Cannot add the same private member more than once") : r instanceof WeakSet ? r.add(e) : r.set(e, t), g = (e, r, t, i) => (He(e, r, "write to private field"), i ? i.call(e, t) : r.set(e, t), t), rt = (e, r, t) => (He(e, r, "access private method"), t);
class y {
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
class er {
  constructor(r) {
    this.service = r;
  }
  async toSub(r, t) {
    try {
      const i = new URL(r.url).searchParams.get("target");
      if (!i)
        return y.error("Unsupported client type");
      if (!["clash", "clashr", "singbox"].includes(i))
        return y.error("Unsupported client type, support list: clash, clashr, singbox");
      const n = await this.service.toSub(r, t, i);
      return y.cors(n);
    } catch (i) {
      return y.error(i.message || "Invalid request");
    }
  }
  async add(r) {
    try {
      const { long_url: t, serve: i } = await r.json();
      if (!t)
        return y.error("Missing long_url");
      const n = new URL(r.url), o = i || `${n.protocol}//${n.host}`, s = await this.service.add(t, o);
      return y.success(s);
    } catch (t) {
      return y.error(t.message || "Invalid request");
    }
  }
  async delete(r) {
    try {
      const i = new URL(r.url).searchParams.get("code");
      return i ? (await this.service.deleteByCode(i), y.success({ deleted: !0 })) : y.error("Missing code");
    } catch (t) {
      return y.error(t.message || "Invalid request");
    }
  }
  async queryByCode(r) {
    try {
      const i = new URL(r.url).searchParams.get("code");
      if (!i)
        return y.error("Missing code");
      const n = await this.service.getByCode(i);
      return n ? y.success(n) : y.error("Not found", 404);
    } catch (t) {
      return y.error(t.message || "Invalid request");
    }
  }
  async queryList(r) {
    try {
      const t = new URL(r.url), i = Number.parseInt(t.searchParams.get("page") || "1"), n = Number.parseInt(t.searchParams.get("pageSize") || "10"), o = await this.service.getList(i, n);
      return y.success(o);
    } catch (t) {
      return y.error(t.message || "Invalid request");
    }
  }
  async redirect(r) {
    var t;
    try {
      const i = (t = r.params) == null ? void 0 : t.code;
      if (!i)
        return y.error("Invalid short URL");
      const n = await this.service.getByCode(i);
      return n ? Response.redirect(n.long_url, 302) : y.error("Not found", 404);
    } catch (i) {
      return y.error(i.message || "Invalid request");
    }
  }
}
class tr {
  constructor() {
    A(this, "routes", []);
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
function rr() {
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
function ir() {
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
function nr() {
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
function or() {
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
function sr() {
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
function ar() {
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
function lr() {
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
const it = lr();
function ur() {
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
                const handleClickOutside = (event) => {
                    const isClickInside = wrapper.contains(event.target) || dropdown.contains(event.target);
                    if (!isClickInside && this.state.isOpen) {
                        closeDropdown();
                        if (this.state.value) {
                            const option = this.state.options.find(opt => opt.value === this.state.value);
                            if (option) {
                                input.value = option.label;
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
                        if (this.state.value) {
                            const option = this.state.options.find(opt => opt.value === this.state.value);
                            if (option) {
                                input.value = option.label;
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
                        if (this.state.value) {
                            const option = this.state.options.find(opt => opt.value === this.state.value);
                            if (option) {
                                input.value = option.label;
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
                let options = this.state.options;

                // 如果是过滤模式且有输入值
                if (this.hasAttribute('filterable') && this.state.filterValue) {
                    // 清空下拉框，只显示当前输入的值
                    const customOption = document.createElement('div');
                    customOption.className = 'sub-select__option';
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
                    this.state.options.push(option);
                }

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
function cr() {
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
function pr() {
  return [
    { label: "Emoji", value: "emoji" },
    { label: "Clash New Field", value: "new_name" },
    { label: "启用 UDP", value: "udp" },
    { label: "排序节点", value: "sort" },
    { label: "启用TFO", value: "tfo" }
  ];
}
function dr(e, r) {
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
function hr(e) {
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
function fr(e, r) {
  if (r.DB === void 0)
    return [];
  const { origin: t } = new URL(e.url);
  return [{ label: t, value: t }];
}
function mr() {
  return [
    { label: "Clash", value: "clash" },
    { label: "ClashR", value: "clashr" },
    { label: "Sing-box", value: "sing-box" }
  ];
}
function gr() {
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
function br() {
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
function vr() {
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
function xr(e, r) {
  var u;
  const t = hr(r), i = dr(e, r), n = fr(e, r), o = mr(), s = pr(), a = r.DB !== void 0, l = `  
    <!DOCTYPE html>
        <html lang="en" theme="dark">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Sub Converter</title>

                ${vr()}
                ${br()}

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
                ${gr()}

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

                            <sub-form-item label="高级选项">
                                <sub-checkbox key="advanced" span="5"></sub-checkbox>
                            </sub-form-item>

                            <sub-form-item label="短链地址">
                                <sub-select key="shortServe" filterable placeholder="${a ? "" : "未配置数据库"}"></sub-select>
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

                ${sr()}
                ${cr()}
                ${ur()}
                ${ir()}
                ${or()}
                ${nr()}
                ${rr()}
                ${ar()}

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
                            advanced: ['emoji', 'new_name'],
                            shortServe: '${((u = n[0]) == null ? void 0 : u.value) ?? ""}',

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
                                    if (type && ['sub-select', 'sub-checkbox'].includes(type)) {
                                        formItem.setAttribute('options', JSON.stringify(formConfig[formItemKey].options));
                                    }

                                    if(formItemKey === 'shortServe' && ${!a}) {
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
  return new Response(l, {
    headers: new Headers({
      "Content-Type": "text/html; charset=UTF-8"
    })
  });
}
/*! js-yaml 4.1.0 https://github.com/nodeca/js-yaml @license MIT */
function Ct(e) {
  return typeof e > "u" || e === null;
}
function wr(e) {
  return typeof e == "object" && e !== null;
}
function Cr(e) {
  return Array.isArray(e) ? e : Ct(e) ? [] : [e];
}
function yr(e, r) {
  var t, i, n, o;
  if (r)
    for (o = Object.keys(r), t = 0, i = o.length; t < i; t += 1)
      n = o[t], e[n] = r[n];
  return e;
}
function _r(e, r) {
  var t = "", i;
  for (i = 0; i < r; i += 1)
    t += e;
  return t;
}
function Sr(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
var Ar = Ct, Er = wr, kr = Cr, Lr = _r, Or = Sr, Tr = yr, S = {
  isNothing: Ar,
  isObject: Er,
  toArray: kr,
  repeat: Lr,
  isNegativeZero: Or,
  extend: Tr
};
function yt(e, r) {
  var t = "", i = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (t += 'in "' + e.mark.name + '" '), t += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !r && e.mark.snippet && (t += `

` + e.mark.snippet), i + " " + t) : i;
}
function be(e, r) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = r, this.message = yt(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
be.prototype = Object.create(Error.prototype);
be.prototype.constructor = be;
be.prototype.toString = function(r) {
  return this.name + ": " + yt(this, r);
};
var T = be;
function Ve(e, r, t, i, n) {
  var o = "", s = "", a = Math.floor(n / 2) - 1;
  return i - r > a && (o = " ... ", r = i - a + o.length), t - i > a && (s = " ...", t = i + a - s.length), {
    str: o + e.slice(r, t).replace(/\t/g, "→") + s,
    pos: i - r + o.length
    // relative position
  };
}
function je(e, r) {
  return S.repeat(" ", r - e.length) + e;
}
function Rr(e, r) {
  if (r = Object.create(r || null), !e.buffer) return null;
  r.maxLength || (r.maxLength = 79), typeof r.indent != "number" && (r.indent = 1), typeof r.linesBefore != "number" && (r.linesBefore = 3), typeof r.linesAfter != "number" && (r.linesAfter = 2);
  for (var t = /\r?\n|\r|\0/g, i = [0], n = [], o, s = -1; o = t.exec(e.buffer); )
    n.push(o.index), i.push(o.index + o[0].length), e.position <= o.index && s < 0 && (s = i.length - 2);
  s < 0 && (s = i.length - 1);
  var a = "", l, u, d = Math.min(e.line + r.linesAfter, n.length).toString().length, p = r.maxLength - (r.indent + d + 3);
  for (l = 1; l <= r.linesBefore && !(s - l < 0); l++)
    u = Ve(
      e.buffer,
      i[s - l],
      n[s - l],
      e.position - (i[s] - i[s - l]),
      p
    ), a = S.repeat(" ", r.indent) + je((e.line - l + 1).toString(), d) + " | " + u.str + `
` + a;
  for (u = Ve(e.buffer, i[s], n[s], e.position, p), a += S.repeat(" ", r.indent) + je((e.line + 1).toString(), d) + " | " + u.str + `
`, a += S.repeat("-", r.indent + d + 3 + u.pos) + `^
`, l = 1; l <= r.linesAfter && !(s + l >= n.length); l++)
    u = Ve(
      e.buffer,
      i[s + l],
      n[s + l],
      e.position - (i[s] - i[s + l]),
      p
    ), a += S.repeat(" ", r.indent) + je((e.line + l + 1).toString(), d) + " | " + u.str + `
`;
  return a.replace(/\n$/, "");
}
var Nr = Rr, Ir = [
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
], Fr = [
  "scalar",
  "sequence",
  "mapping"
];
function Pr(e) {
  var r = {};
  return e !== null && Object.keys(e).forEach(function(t) {
    e[t].forEach(function(i) {
      r[String(i)] = t;
    });
  }), r;
}
function Mr(e, r) {
  if (r = r || {}, Object.keys(r).forEach(function(t) {
    if (Ir.indexOf(t) === -1)
      throw new T('Unknown option "' + t + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = r, this.tag = e, this.kind = r.kind || null, this.resolve = r.resolve || function() {
    return !0;
  }, this.construct = r.construct || function(t) {
    return t;
  }, this.instanceOf = r.instanceOf || null, this.predicate = r.predicate || null, this.represent = r.represent || null, this.representName = r.representName || null, this.defaultStyle = r.defaultStyle || null, this.multi = r.multi || !1, this.styleAliases = Pr(r.styleAliases || null), Fr.indexOf(this.kind) === -1)
    throw new T('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var E = Mr;
function nt(e, r) {
  var t = [];
  return e[r].forEach(function(i) {
    var n = t.length;
    t.forEach(function(o, s) {
      o.tag === i.tag && o.kind === i.kind && o.multi === i.multi && (n = s);
    }), t[n] = i;
  }), t;
}
function Ur() {
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
    throw new T("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  t.forEach(function(o) {
    if (!(o instanceof E))
      throw new T("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (o.loadKind && o.loadKind !== "scalar")
      throw new T("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (o.multi)
      throw new T("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), i.forEach(function(o) {
    if (!(o instanceof E))
      throw new T("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var n = Object.create(ze.prototype);
  return n.implicit = (this.implicit || []).concat(t), n.explicit = (this.explicit || []).concat(i), n.compiledImplicit = nt(n, "implicit"), n.compiledExplicit = nt(n, "explicit"), n.compiledTypeMap = Ur(n.compiledImplicit, n.compiledExplicit), n;
};
var Dr = ze, Br = new E("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), Hr = new E("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), Vr = new E("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), jr = new Dr({
  explicit: [
    Br,
    Hr,
    Vr
  ]
});
function $r(e) {
  if (e === null) return !0;
  var r = e.length;
  return r === 1 && e === "~" || r === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function zr() {
  return null;
}
function Yr(e) {
  return e === null;
}
var Wr = new E("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: $r,
  construct: zr,
  predicate: Yr,
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
function qr(e) {
  if (e === null) return !1;
  var r = e.length;
  return r === 4 && (e === "true" || e === "True" || e === "TRUE") || r === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function Gr(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function Kr(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var Jr = new E("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: qr,
  construct: Gr,
  predicate: Kr,
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
function Qr(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function Xr(e) {
  return 48 <= e && e <= 55;
}
function Zr(e) {
  return 48 <= e && e <= 57;
}
function ei(e) {
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
          if (!Qr(e.charCodeAt(t))) return !1;
          i = !0;
        }
      return i && n !== "_";
    }
    if (n === "o") {
      for (t++; t < r; t++)
        if (n = e[t], n !== "_") {
          if (!Xr(e.charCodeAt(t))) return !1;
          i = !0;
        }
      return i && n !== "_";
    }
  }
  if (n === "_") return !1;
  for (; t < r; t++)
    if (n = e[t], n !== "_") {
      if (!Zr(e.charCodeAt(t)))
        return !1;
      i = !0;
    }
  return !(!i || n === "_");
}
function ti(e) {
  var r = e, t = 1, i;
  if (r.indexOf("_") !== -1 && (r = r.replace(/_/g, "")), i = r[0], (i === "-" || i === "+") && (i === "-" && (t = -1), r = r.slice(1), i = r[0]), r === "0") return 0;
  if (i === "0") {
    if (r[1] === "b") return t * parseInt(r.slice(2), 2);
    if (r[1] === "x") return t * parseInt(r.slice(2), 16);
    if (r[1] === "o") return t * parseInt(r.slice(2), 8);
  }
  return t * parseInt(r, 10);
}
function ri(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !S.isNegativeZero(e);
}
var ii = new E("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: ei,
  construct: ti,
  predicate: ri,
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
}), ni = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function oi(e) {
  return !(e === null || !ni.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function si(e) {
  var r, t;
  return r = e.replace(/_/g, "").toLowerCase(), t = r[0] === "-" ? -1 : 1, "+-".indexOf(r[0]) >= 0 && (r = r.slice(1)), r === ".inf" ? t === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : r === ".nan" ? NaN : t * parseFloat(r, 10);
}
var ai = /^[-+]?[0-9]+e/;
function li(e, r) {
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
  else if (S.isNegativeZero(e))
    return "-0.0";
  return t = e.toString(10), ai.test(t) ? t.replace("e", ".e") : t;
}
function ui(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || S.isNegativeZero(e));
}
var ci = new E("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: oi,
  construct: si,
  predicate: ui,
  represent: li,
  defaultStyle: "lowercase"
}), pi = jr.extend({
  implicit: [
    Wr,
    Jr,
    ii,
    ci
  ]
}), di = pi, _t = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), St = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function hi(e) {
  return e === null ? !1 : _t.exec(e) !== null || St.exec(e) !== null;
}
function fi(e) {
  var r, t, i, n, o, s, a, l = 0, u = null, d, p, f;
  if (r = _t.exec(e), r === null && (r = St.exec(e)), r === null) throw new Error("Date resolve error");
  if (t = +r[1], i = +r[2] - 1, n = +r[3], !r[4])
    return new Date(Date.UTC(t, i, n));
  if (o = +r[4], s = +r[5], a = +r[6], r[7]) {
    for (l = r[7].slice(0, 3); l.length < 3; )
      l += "0";
    l = +l;
  }
  return r[9] && (d = +r[10], p = +(r[11] || 0), u = (d * 60 + p) * 6e4, r[9] === "-" && (u = -u)), f = new Date(Date.UTC(t, i, n, o, s, a, l)), u && f.setTime(f.getTime() - u), f;
}
function mi(e) {
  return e.toISOString();
}
var gi = new E("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: hi,
  construct: fi,
  instanceOf: Date,
  represent: mi
});
function bi(e) {
  return e === "<<" || e === null;
}
var vi = new E("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: bi
}), Je = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function xi(e) {
  if (e === null) return !1;
  var r, t, i = 0, n = e.length, o = Je;
  for (t = 0; t < n; t++)
    if (r = o.indexOf(e.charAt(t)), !(r > 64)) {
      if (r < 0) return !1;
      i += 6;
    }
  return i % 8 === 0;
}
function wi(e) {
  var r, t, i = e.replace(/[\r\n=]/g, ""), n = i.length, o = Je, s = 0, a = [];
  for (r = 0; r < n; r++)
    r % 4 === 0 && r && (a.push(s >> 16 & 255), a.push(s >> 8 & 255), a.push(s & 255)), s = s << 6 | o.indexOf(i.charAt(r));
  return t = n % 4 * 6, t === 0 ? (a.push(s >> 16 & 255), a.push(s >> 8 & 255), a.push(s & 255)) : t === 18 ? (a.push(s >> 10 & 255), a.push(s >> 2 & 255)) : t === 12 && a.push(s >> 4 & 255), new Uint8Array(a);
}
function Ci(e) {
  var r = "", t = 0, i, n, o = e.length, s = Je;
  for (i = 0; i < o; i++)
    i % 3 === 0 && i && (r += s[t >> 18 & 63], r += s[t >> 12 & 63], r += s[t >> 6 & 63], r += s[t & 63]), t = (t << 8) + e[i];
  return n = o % 3, n === 0 ? (r += s[t >> 18 & 63], r += s[t >> 12 & 63], r += s[t >> 6 & 63], r += s[t & 63]) : n === 2 ? (r += s[t >> 10 & 63], r += s[t >> 4 & 63], r += s[t << 2 & 63], r += s[64]) : n === 1 && (r += s[t >> 2 & 63], r += s[t << 4 & 63], r += s[64], r += s[64]), r;
}
function yi(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var _i = new E("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: xi,
  construct: wi,
  predicate: yi,
  represent: Ci
}), Si = Object.prototype.hasOwnProperty, Ai = Object.prototype.toString;
function Ei(e) {
  if (e === null) return !0;
  var r = [], t, i, n, o, s, a = e;
  for (t = 0, i = a.length; t < i; t += 1) {
    if (n = a[t], s = !1, Ai.call(n) !== "[object Object]") return !1;
    for (o in n)
      if (Si.call(n, o))
        if (!s) s = !0;
        else return !1;
    if (!s) return !1;
    if (r.indexOf(o) === -1) r.push(o);
    else return !1;
  }
  return !0;
}
function ki(e) {
  return e !== null ? e : [];
}
var Li = new E("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: Ei,
  construct: ki
}), Oi = Object.prototype.toString;
function Ti(e) {
  if (e === null) return !0;
  var r, t, i, n, o, s = e;
  for (o = new Array(s.length), r = 0, t = s.length; r < t; r += 1) {
    if (i = s[r], Oi.call(i) !== "[object Object]" || (n = Object.keys(i), n.length !== 1)) return !1;
    o[r] = [n[0], i[n[0]]];
  }
  return !0;
}
function Ri(e) {
  if (e === null) return [];
  var r, t, i, n, o, s = e;
  for (o = new Array(s.length), r = 0, t = s.length; r < t; r += 1)
    i = s[r], n = Object.keys(i), o[r] = [n[0], i[n[0]]];
  return o;
}
var Ni = new E("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: Ti,
  construct: Ri
}), Ii = Object.prototype.hasOwnProperty;
function Fi(e) {
  if (e === null) return !0;
  var r, t = e;
  for (r in t)
    if (Ii.call(t, r) && t[r] !== null)
      return !1;
  return !0;
}
function Pi(e) {
  return e !== null ? e : {};
}
var Mi = new E("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: Fi,
  construct: Pi
}), At = di.extend({
  implicit: [
    gi,
    vi
  ],
  explicit: [
    _i,
    Li,
    Ni,
    Mi
  ]
}), W = Object.prototype.hasOwnProperty, Ne = 1, Et = 2, kt = 3, Ie = 4, $e = 1, Ui = 2, ot = 3, Di = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, Bi = /[\x85\u2028\u2029]/, Hi = /[,\[\]\{\}]/, Lt = /^(?:!|!!|![a-z\-]+!)$/i, Ot = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function st(e) {
  return Object.prototype.toString.call(e);
}
function D(e) {
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
function Vi(e) {
  var r;
  return 48 <= e && e <= 57 ? e - 48 : (r = e | 32, 97 <= r && r <= 102 ? r - 97 + 10 : -1);
}
function ji(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function $i(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function at(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function zi(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
var Tt = new Array(256), Rt = new Array(256);
for (var oe = 0; oe < 256; oe++)
  Tt[oe] = at(oe) ? 1 : 0, Rt[oe] = at(oe);
function Yi(e, r) {
  this.input = e, this.filename = r.filename || null, this.schema = r.schema || At, this.onWarning = r.onWarning || null, this.legacy = r.legacy || !1, this.json = r.json || !1, this.listener = r.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function Nt(e, r) {
  var t = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return t.snippet = Nr(t), new T(r, t);
}
function m(e, r) {
  throw Nt(e, r);
}
function Fe(e, r) {
  e.onWarning && e.onWarning.call(null, Nt(e, r));
}
var lt = {
  YAML: function(r, t, i) {
    var n, o, s;
    r.version !== null && m(r, "duplication of %YAML directive"), i.length !== 1 && m(r, "YAML directive accepts exactly one argument"), n = /^([0-9]+)\.([0-9]+)$/.exec(i[0]), n === null && m(r, "ill-formed argument of the YAML directive"), o = parseInt(n[1], 10), s = parseInt(n[2], 10), o !== 1 && m(r, "unacceptable YAML version of the document"), r.version = i[0], r.checkLineBreaks = s < 2, s !== 1 && s !== 2 && Fe(r, "unsupported YAML version of the document");
  },
  TAG: function(r, t, i) {
    var n, o;
    i.length !== 2 && m(r, "TAG directive accepts exactly two arguments"), n = i[0], o = i[1], Lt.test(n) || m(r, "ill-formed tag handle (first argument) of the TAG directive"), W.call(r.tagMap, n) && m(r, 'there is a previously declared suffix for "' + n + '" tag handle'), Ot.test(o) || m(r, "ill-formed tag prefix (second argument) of the TAG directive");
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
    else Di.test(a) && m(e, "the stream contains non-printable characters");
    e.result += a;
  }
}
function ut(e, r, t, i) {
  var n, o, s, a;
  for (S.isObject(t) || m(e, "cannot merge mappings; the provided source object is unacceptable"), n = Object.keys(t), s = 0, a = n.length; s < a; s += 1)
    o = n[s], W.call(r, o) || (r[o] = t[o], i[o] = !0);
}
function le(e, r, t, i, n, o, s, a, l) {
  var u, d;
  if (Array.isArray(n))
    for (n = Array.prototype.slice.call(n), u = 0, d = n.length; u < d; u += 1)
      Array.isArray(n[u]) && m(e, "nested arrays are not supported inside keys"), typeof n == "object" && st(n[u]) === "[object Object]" && (n[u] = "[object Object]");
  if (typeof n == "object" && st(n) === "[object Object]" && (n = "[object Object]"), n = String(n), r === null && (r = {}), i === "tag:yaml.org,2002:merge")
    if (Array.isArray(o))
      for (u = 0, d = o.length; u < d; u += 1)
        ut(e, r, o[u], t);
    else
      ut(e, r, o, t);
  else
    !e.json && !W.call(t, n) && W.call(r, n) && (e.line = s || e.line, e.lineStart = a || e.lineStart, e.position = l || e.position, m(e, "duplicated mapping key")), n === "__proto__" ? Object.defineProperty(r, n, {
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
function _(e, r, t) {
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
function Be(e) {
  var r = e.position, t;
  return t = e.input.charCodeAt(r), !!((t === 45 || t === 46) && t === e.input.charCodeAt(r + 1) && t === e.input.charCodeAt(r + 2) && (r += 3, t = e.input.charCodeAt(r), t === 0 || R(t)));
}
function Xe(e, r) {
  r === 1 ? e.result += " " : r > 1 && (e.result += S.repeat(`
`, r - 1));
}
function Wi(e, r, t) {
  var i, n, o, s, a, l, u, d, p = e.kind, f = e.result, h;
  if (h = e.input.charCodeAt(e.position), R(h) || ae(h) || h === 35 || h === 38 || h === 42 || h === 33 || h === 124 || h === 62 || h === 39 || h === 34 || h === 37 || h === 64 || h === 96 || (h === 63 || h === 45) && (n = e.input.charCodeAt(e.position + 1), R(n) || t && ae(n)))
    return !1;
  for (e.kind = "scalar", e.result = "", o = s = e.position, a = !1; h !== 0; ) {
    if (h === 58) {
      if (n = e.input.charCodeAt(e.position + 1), R(n) || t && ae(n))
        break;
    } else if (h === 35) {
      if (i = e.input.charCodeAt(e.position - 1), R(i))
        break;
    } else {
      if (e.position === e.lineStart && Be(e) || t && ae(h))
        break;
      if (D(h))
        if (l = e.line, u = e.lineStart, d = e.lineIndent, _(e, !1, -1), e.lineIndent >= r) {
          a = !0, h = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = s, e.line = l, e.lineStart = u, e.lineIndent = d;
          break;
        }
    }
    a && (Y(e, o, s, !1), Xe(e, e.line - l), o = s = e.position, a = !1), ne(h) || (s = e.position + 1), h = e.input.charCodeAt(++e.position);
  }
  return Y(e, o, s, !1), e.result ? !0 : (e.kind = p, e.result = f, !1);
}
function qi(e, r) {
  var t, i, n;
  if (t = e.input.charCodeAt(e.position), t !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, i = n = e.position; (t = e.input.charCodeAt(e.position)) !== 0; )
    if (t === 39)
      if (Y(e, i, e.position, !0), t = e.input.charCodeAt(++e.position), t === 39)
        i = e.position, e.position++, n = e.position;
      else
        return !0;
    else D(t) ? (Y(e, i, n, !0), Xe(e, _(e, !1, r)), i = n = e.position) : e.position === e.lineStart && Be(e) ? m(e, "unexpected end of the document within a single quoted scalar") : (e.position++, n = e.position);
  m(e, "unexpected end of the stream within a single quoted scalar");
}
function Gi(e, r) {
  var t, i, n, o, s, a;
  if (a = e.input.charCodeAt(e.position), a !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, t = i = e.position; (a = e.input.charCodeAt(e.position)) !== 0; ) {
    if (a === 34)
      return Y(e, t, e.position, !0), e.position++, !0;
    if (a === 92) {
      if (Y(e, t, e.position, !0), a = e.input.charCodeAt(++e.position), D(a))
        _(e, !1, r);
      else if (a < 256 && Tt[a])
        e.result += Rt[a], e.position++;
      else if ((s = ji(a)) > 0) {
        for (n = s, o = 0; n > 0; n--)
          a = e.input.charCodeAt(++e.position), (s = Vi(a)) >= 0 ? o = (o << 4) + s : m(e, "expected hexadecimal character");
        e.result += zi(o), e.position++;
      } else
        m(e, "unknown escape sequence");
      t = i = e.position;
    } else D(a) ? (Y(e, t, i, !0), Xe(e, _(e, !1, r)), t = i = e.position) : e.position === e.lineStart && Be(e) ? m(e, "unexpected end of the document within a double quoted scalar") : (e.position++, i = e.position);
  }
  m(e, "unexpected end of the stream within a double quoted scalar");
}
function Ki(e, r) {
  var t = !0, i, n, o, s = e.tag, a, l = e.anchor, u, d, p, f, h, b = /* @__PURE__ */ Object.create(null), v, C, O, w;
  if (w = e.input.charCodeAt(e.position), w === 91)
    d = 93, h = !1, a = [];
  else if (w === 123)
    d = 125, h = !0, a = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = a), w = e.input.charCodeAt(++e.position); w !== 0; ) {
    if (_(e, !0, r), w = e.input.charCodeAt(e.position), w === d)
      return e.position++, e.tag = s, e.anchor = l, e.kind = h ? "mapping" : "sequence", e.result = a, !0;
    t ? w === 44 && m(e, "expected the node content, but found ','") : m(e, "missed comma between flow collection entries"), C = v = O = null, p = f = !1, w === 63 && (u = e.input.charCodeAt(e.position + 1), R(u) && (p = f = !0, e.position++, _(e, !0, r))), i = e.line, n = e.lineStart, o = e.position, me(e, r, Ne, !1, !0), C = e.tag, v = e.result, _(e, !0, r), w = e.input.charCodeAt(e.position), (f || e.line === i) && w === 58 && (p = !0, w = e.input.charCodeAt(++e.position), _(e, !0, r), me(e, r, Ne, !1, !0), O = e.result), h ? le(e, a, b, C, v, O, i, n, o) : p ? a.push(le(e, null, b, C, v, O, i, n, o)) : a.push(v), _(e, !0, r), w = e.input.charCodeAt(e.position), w === 44 ? (t = !0, w = e.input.charCodeAt(++e.position)) : t = !1;
  }
  m(e, "unexpected end of the stream within a flow collection");
}
function Ji(e, r) {
  var t, i, n = $e, o = !1, s = !1, a = r, l = 0, u = !1, d, p;
  if (p = e.input.charCodeAt(e.position), p === 124)
    i = !1;
  else if (p === 62)
    i = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; p !== 0; )
    if (p = e.input.charCodeAt(++e.position), p === 43 || p === 45)
      $e === n ? n = p === 43 ? ot : Ui : m(e, "repeat of a chomping mode identifier");
    else if ((d = $i(p)) >= 0)
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
      n === ot ? e.result += S.repeat(`
`, o ? 1 + l : l) : n === $e && o && (e.result += `
`);
      break;
    }
    for (i ? ne(p) ? (u = !0, e.result += S.repeat(`
`, o ? 1 + l : l)) : u ? (u = !1, e.result += S.repeat(`
`, l + 1)) : l === 0 ? o && (e.result += " ") : e.result += S.repeat(`
`, l) : e.result += S.repeat(`
`, o ? 1 + l : l), o = !0, s = !0, l = 0, t = e.position; !D(p) && p !== 0; )
      p = e.input.charCodeAt(++e.position);
    Y(e, t, e.position, !1);
  }
  return !0;
}
function ct(e, r) {
  var t, i = e.tag, n = e.anchor, o = [], s, a = !1, l;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), l = e.input.charCodeAt(e.position); l !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, m(e, "tab characters must not be used in indentation")), !(l !== 45 || (s = e.input.charCodeAt(e.position + 1), !R(s)))); ) {
    if (a = !0, e.position++, _(e, !0, -1) && e.lineIndent <= r) {
      o.push(null), l = e.input.charCodeAt(e.position);
      continue;
    }
    if (t = e.line, me(e, r, kt, !1, !0), o.push(e.result), _(e, !0, -1), l = e.input.charCodeAt(e.position), (e.line === t || e.lineIndent > r) && l !== 0)
      m(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < r)
      break;
  }
  return a ? (e.tag = i, e.anchor = n, e.kind = "sequence", e.result = o, !0) : !1;
}
function Qi(e, r, t) {
  var i, n, o, s, a, l, u = e.tag, d = e.anchor, p = {}, f = /* @__PURE__ */ Object.create(null), h = null, b = null, v = null, C = !1, O = !1, w;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = p), w = e.input.charCodeAt(e.position); w !== 0; ) {
    if (!C && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, m(e, "tab characters must not be used in indentation")), i = e.input.charCodeAt(e.position + 1), o = e.line, (w === 63 || w === 58) && R(i))
      w === 63 ? (C && (le(e, p, f, h, b, null, s, a, l), h = b = v = null), O = !0, C = !0, n = !0) : C ? (C = !1, n = !0) : m(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, w = i;
    else {
      if (s = e.line, a = e.lineStart, l = e.position, !me(e, t, Et, !1, !0))
        break;
      if (e.line === o) {
        for (w = e.input.charCodeAt(e.position); ne(w); )
          w = e.input.charCodeAt(++e.position);
        if (w === 58)
          w = e.input.charCodeAt(++e.position), R(w) || m(e, "a whitespace character is expected after the key-value separator within a block mapping"), C && (le(e, p, f, h, b, null, s, a, l), h = b = v = null), O = !0, C = !1, n = !1, h = e.tag, b = e.result;
        else if (O)
          m(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = u, e.anchor = d, !0;
      } else if (O)
        m(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = u, e.anchor = d, !0;
    }
    if ((e.line === o || e.lineIndent > r) && (C && (s = e.line, a = e.lineStart, l = e.position), me(e, r, Ie, !0, n) && (C ? b = e.result : v = e.result), C || (le(e, p, f, h, b, v, s, a, l), h = b = v = null), _(e, !0, -1), w = e.input.charCodeAt(e.position)), (e.line === o || e.lineIndent > r) && w !== 0)
      m(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < r)
      break;
  }
  return C && le(e, p, f, h, b, null, s, a, l), O && (e.tag = u, e.anchor = d, e.kind = "mapping", e.result = p), O;
}
function Xi(e) {
  var r, t = !1, i = !1, n, o, s;
  if (s = e.input.charCodeAt(e.position), s !== 33) return !1;
  if (e.tag !== null && m(e, "duplication of a tag property"), s = e.input.charCodeAt(++e.position), s === 60 ? (t = !0, s = e.input.charCodeAt(++e.position)) : s === 33 ? (i = !0, n = "!!", s = e.input.charCodeAt(++e.position)) : n = "!", r = e.position, t) {
    do
      s = e.input.charCodeAt(++e.position);
    while (s !== 0 && s !== 62);
    e.position < e.length ? (o = e.input.slice(r, e.position), s = e.input.charCodeAt(++e.position)) : m(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; s !== 0 && !R(s); )
      s === 33 && (i ? m(e, "tag suffix cannot contain exclamation marks") : (n = e.input.slice(r - 1, e.position + 1), Lt.test(n) || m(e, "named tag handle cannot contain such characters"), i = !0, r = e.position + 1)), s = e.input.charCodeAt(++e.position);
    o = e.input.slice(r, e.position), Hi.test(o) && m(e, "tag suffix cannot contain flow indicator characters");
  }
  o && !Ot.test(o) && m(e, "tag name cannot contain such characters: " + o);
  try {
    o = decodeURIComponent(o);
  } catch {
    m(e, "tag name is malformed: " + o);
  }
  return t ? e.tag = o : W.call(e.tagMap, n) ? e.tag = e.tagMap[n] + o : n === "!" ? e.tag = "!" + o : n === "!!" ? e.tag = "tag:yaml.org,2002:" + o : m(e, 'undeclared tag handle "' + n + '"'), !0;
}
function Zi(e) {
  var r, t;
  if (t = e.input.charCodeAt(e.position), t !== 38) return !1;
  for (e.anchor !== null && m(e, "duplication of an anchor property"), t = e.input.charCodeAt(++e.position), r = e.position; t !== 0 && !R(t) && !ae(t); )
    t = e.input.charCodeAt(++e.position);
  return e.position === r && m(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(r, e.position), !0;
}
function en(e) {
  var r, t, i;
  if (i = e.input.charCodeAt(e.position), i !== 42) return !1;
  for (i = e.input.charCodeAt(++e.position), r = e.position; i !== 0 && !R(i) && !ae(i); )
    i = e.input.charCodeAt(++e.position);
  return e.position === r && m(e, "name of an alias node must contain at least one character"), t = e.input.slice(r, e.position), W.call(e.anchorMap, t) || m(e, 'unidentified alias "' + t + '"'), e.result = e.anchorMap[t], _(e, !0, -1), !0;
}
function me(e, r, t, i, n) {
  var o, s, a, l = 1, u = !1, d = !1, p, f, h, b, v, C;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, o = s = a = Ie === t || kt === t, i && _(e, !0, -1) && (u = !0, e.lineIndent > r ? l = 1 : e.lineIndent === r ? l = 0 : e.lineIndent < r && (l = -1)), l === 1)
    for (; Xi(e) || Zi(e); )
      _(e, !0, -1) ? (u = !0, a = o, e.lineIndent > r ? l = 1 : e.lineIndent === r ? l = 0 : e.lineIndent < r && (l = -1)) : a = !1;
  if (a && (a = u || n), (l === 1 || Ie === t) && (Ne === t || Et === t ? v = r : v = r + 1, C = e.position - e.lineStart, l === 1 ? a && (ct(e, C) || Qi(e, C, v)) || Ki(e, v) ? d = !0 : (s && Ji(e, v) || qi(e, v) || Gi(e, v) ? d = !0 : en(e) ? (d = !0, (e.tag !== null || e.anchor !== null) && m(e, "alias node should not have any properties")) : Wi(e, v, Ne === t) && (d = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : l === 0 && (d = a && ct(e, C))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && m(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), p = 0, f = e.implicitTypes.length; p < f; p += 1)
      if (b = e.implicitTypes[p], b.resolve(e.result)) {
        e.result = b.construct(e.result), e.tag = b.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (W.call(e.typeMap[e.kind || "fallback"], e.tag))
      b = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (b = null, h = e.typeMap.multi[e.kind || "fallback"], p = 0, f = h.length; p < f; p += 1)
        if (e.tag.slice(0, h[p].tag.length) === h[p].tag) {
          b = h[p];
          break;
        }
    b || m(e, "unknown tag !<" + e.tag + ">"), e.result !== null && b.kind !== e.kind && m(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + b.kind + '", not "' + e.kind + '"'), b.resolve(e.result, e.tag) ? (e.result = b.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : m(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || d;
}
function tn(e) {
  var r = e.position, t, i, n, o = !1, s;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (s = e.input.charCodeAt(e.position)) !== 0 && (_(e, !0, -1), s = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || s !== 37)); ) {
    for (o = !0, s = e.input.charCodeAt(++e.position), t = e.position; s !== 0 && !R(s); )
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
      for (t = e.position; s !== 0 && !R(s); )
        s = e.input.charCodeAt(++e.position);
      n.push(e.input.slice(t, e.position));
    }
    s !== 0 && Qe(e), W.call(lt, i) ? lt[i](e, i, n) : Fe(e, 'unknown document directive "' + i + '"');
  }
  if (_(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, _(e, !0, -1)) : o && m(e, "directives end mark is expected"), me(e, e.lineIndent - 1, Ie, !1, !0), _(e, !0, -1), e.checkLineBreaks && Bi.test(e.input.slice(r, e.position)) && Fe(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && Be(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, _(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    m(e, "end of the stream or a document separator is expected");
  else
    return;
}
function It(e, r) {
  e = String(e), r = r || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var t = new Yi(e, r), i = e.indexOf("\0");
  for (i !== -1 && (t.position = i, m(t, "null byte is not allowed in input")), t.input += "\0"; t.input.charCodeAt(t.position) === 32; )
    t.lineIndent += 1, t.position += 1;
  for (; t.position < t.length - 1; )
    tn(t);
  return t.documents;
}
function rn(e, r, t) {
  r !== null && typeof r == "object" && typeof t > "u" && (t = r, r = null);
  var i = It(e, t);
  if (typeof r != "function")
    return i;
  for (var n = 0, o = i.length; n < o; n += 1)
    r(i[n]);
}
function nn(e, r) {
  var t = It(e, r);
  if (t.length !== 0) {
    if (t.length === 1)
      return t[0];
    throw new T("expected a single document in the stream, but found more");
  }
}
var on = rn, sn = nn, an = {
  loadAll: on,
  load: sn
}, Ft = Object.prototype.toString, Pt = Object.prototype.hasOwnProperty, Ze = 65279, ln = 9, ve = 10, un = 13, cn = 32, pn = 33, dn = 34, Ye = 35, hn = 37, fn = 38, mn = 39, gn = 42, Mt = 44, bn = 45, Pe = 58, vn = 61, xn = 62, wn = 63, Cn = 64, Ut = 91, Dt = 93, yn = 96, Bt = 123, _n = 124, Ht = 125, k = {};
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
var Sn = [
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
], An = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function En(e, r) {
  var t, i, n, o, s, a, l;
  if (r === null) return {};
  for (t = {}, i = Object.keys(r), n = 0, o = i.length; n < o; n += 1)
    s = i[n], a = String(r[s]), s.slice(0, 2) === "!!" && (s = "tag:yaml.org,2002:" + s.slice(2)), l = e.compiledTypeMap.fallback[s], l && Pt.call(l.styleAliases, a) && (a = l.styleAliases[a]), t[s] = a;
  return t;
}
function kn(e) {
  var r, t, i;
  if (r = e.toString(16).toUpperCase(), e <= 255)
    t = "x", i = 2;
  else if (e <= 65535)
    t = "u", i = 4;
  else if (e <= 4294967295)
    t = "U", i = 8;
  else
    throw new T("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + t + S.repeat("0", i - r.length) + r;
}
var Ln = 1, xe = 2;
function On(e) {
  this.schema = e.schema || At, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = S.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = En(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? xe : Ln, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function pt(e, r) {
  for (var t = S.repeat(" ", r), i = 0, n = -1, o = "", s, a = e.length; i < a; )
    n = e.indexOf(`
`, i), n === -1 ? (s = e.slice(i), i = a) : (s = e.slice(i, n + 1), i = n + 1), s.length && s !== `
` && (o += t), o += s;
  return o;
}
function We(e, r) {
  return `
` + S.repeat(" ", e.indent * r);
}
function Tn(e, r) {
  var t, i, n;
  for (t = 0, i = e.implicitTypes.length; t < i; t += 1)
    if (n = e.implicitTypes[t], n.resolve(r))
      return !0;
  return !1;
}
function Me(e) {
  return e === cn || e === ln;
}
function we(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== Ze || 65536 <= e && e <= 1114111;
}
function dt(e) {
  return we(e) && e !== Ze && e !== un && e !== ve;
}
function ht(e, r, t) {
  var i = dt(e), n = i && !Me(e);
  return (
    // ns-plain-safe
    (t ? (
      // c = flow-in
      i
    ) : i && e !== Mt && e !== Ut && e !== Dt && e !== Bt && e !== Ht) && e !== Ye && !(r === Pe && !n) || dt(r) && !Me(r) && e === Ye || r === Pe && n
  );
}
function Rn(e) {
  return we(e) && e !== Ze && !Me(e) && e !== bn && e !== wn && e !== Pe && e !== Mt && e !== Ut && e !== Dt && e !== Bt && e !== Ht && e !== Ye && e !== fn && e !== gn && e !== pn && e !== _n && e !== vn && e !== xn && e !== mn && e !== dn && e !== hn && e !== Cn && e !== yn;
}
function Nn(e) {
  return !Me(e) && e !== Pe;
}
function ge(e, r) {
  var t = e.charCodeAt(r), i;
  return t >= 55296 && t <= 56319 && r + 1 < e.length && (i = e.charCodeAt(r + 1), i >= 56320 && i <= 57343) ? (t - 55296) * 1024 + i - 56320 + 65536 : t;
}
function Vt(e) {
  var r = /^\n* /;
  return r.test(e);
}
var jt = 1, qe = 2, $t = 3, zt = 4, se = 5;
function In(e, r, t, i, n, o, s, a) {
  var l, u = 0, d = null, p = !1, f = !1, h = i !== -1, b = -1, v = Rn(ge(e, 0)) && Nn(ge(e, e.length - 1));
  if (r || s)
    for (l = 0; l < e.length; u >= 65536 ? l += 2 : l++) {
      if (u = ge(e, l), !we(u))
        return se;
      v = v && ht(u, d, a), d = u;
    }
  else {
    for (l = 0; l < e.length; u >= 65536 ? l += 2 : l++) {
      if (u = ge(e, l), u === ve)
        p = !0, h && (f = f || // Foldable line = too long, and not more-indented.
        l - b - 1 > i && e[b + 1] !== " ", b = l);
      else if (!we(u))
        return se;
      v = v && ht(u, d, a), d = u;
    }
    f = f || h && l - b - 1 > i && e[b + 1] !== " ";
  }
  return !p && !f ? v && !s && !n(e) ? jt : o === xe ? se : qe : t > 9 && Vt(e) ? se : s ? o === xe ? se : qe : f ? zt : $t;
}
function Fn(e, r, t, i, n) {
  e.dump = function() {
    if (r.length === 0)
      return e.quotingType === xe ? '""' : "''";
    if (!e.noCompatMode && (Sn.indexOf(r) !== -1 || An.test(r)))
      return e.quotingType === xe ? '"' + r + '"' : "'" + r + "'";
    var o = e.indent * Math.max(1, t), s = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), a = i || e.flowLevel > -1 && t >= e.flowLevel;
    function l(u) {
      return Tn(e, u);
    }
    switch (In(
      r,
      a,
      e.indent,
      s,
      l,
      e.quotingType,
      e.forceQuotes && !i,
      n
    )) {
      case jt:
        return r;
      case qe:
        return "'" + r.replace(/'/g, "''") + "'";
      case $t:
        return "|" + ft(r, e.indent) + mt(pt(r, o));
      case zt:
        return ">" + ft(r, e.indent) + mt(pt(Pn(r, s), o));
      case se:
        return '"' + Mn(r) + '"';
      default:
        throw new T("impossible error: invalid scalar style");
    }
  }();
}
function ft(e, r) {
  var t = Vt(e) ? String(r) : "", i = e[e.length - 1] === `
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
function Pn(e, r) {
  for (var t = /(\n+)([^\n]*)/g, i = function() {
    var u = e.indexOf(`
`);
    return u = u !== -1 ? u : e.length, t.lastIndex = u, gt(e.slice(0, u), r);
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
function Mn(e) {
  for (var r = "", t = 0, i, n = 0; n < e.length; t >= 65536 ? n += 2 : n++)
    t = ge(e, n), i = k[t], !i && we(t) ? (r += e[n], t >= 65536 && (r += e[n + 1])) : r += i || kn(t);
  return r;
}
function Un(e, r, t) {
  var i = "", n = e.tag, o, s, a;
  for (o = 0, s = t.length; o < s; o += 1)
    a = t[o], e.replacer && (a = e.replacer.call(t, String(o), a)), (H(e, r, a, !1, !1) || typeof a > "u" && H(e, r, null, !1, !1)) && (i !== "" && (i += "," + (e.condenseFlow ? "" : " ")), i += e.dump);
  e.tag = n, e.dump = "[" + i + "]";
}
function bt(e, r, t, i) {
  var n = "", o = e.tag, s, a, l;
  for (s = 0, a = t.length; s < a; s += 1)
    l = t[s], e.replacer && (l = e.replacer.call(t, String(s), l)), (H(e, r + 1, l, !0, !0, !1, !0) || typeof l > "u" && H(e, r + 1, null, !0, !0, !1, !0)) && ((!i || n !== "") && (n += We(e, r)), e.dump && ve === e.dump.charCodeAt(0) ? n += "-" : n += "- ", n += e.dump);
  e.tag = o, e.dump = n || "[]";
}
function Dn(e, r, t) {
  var i = "", n = e.tag, o = Object.keys(t), s, a, l, u, d;
  for (s = 0, a = o.length; s < a; s += 1)
    d = "", i !== "" && (d += ", "), e.condenseFlow && (d += '"'), l = o[s], u = t[l], e.replacer && (u = e.replacer.call(t, l, u)), H(e, r, l, !1, !1) && (e.dump.length > 1024 && (d += "? "), d += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), H(e, r, u, !1, !1) && (d += e.dump, i += d));
  e.tag = n, e.dump = "{" + i + "}";
}
function Bn(e, r, t, i) {
  var n = "", o = e.tag, s = Object.keys(t), a, l, u, d, p, f;
  if (e.sortKeys === !0)
    s.sort();
  else if (typeof e.sortKeys == "function")
    s.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new T("sortKeys must be a boolean or a function");
  for (a = 0, l = s.length; a < l; a += 1)
    f = "", (!i || n !== "") && (f += We(e, r)), u = s[a], d = t[u], e.replacer && (d = e.replacer.call(t, u, d)), H(e, r + 1, u, !0, !0, !0) && (p = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, p && (e.dump && ve === e.dump.charCodeAt(0) ? f += "?" : f += "? "), f += e.dump, p && (f += We(e, r)), H(e, r + 1, d, !0, p) && (e.dump && ve === e.dump.charCodeAt(0) ? f += ":" : f += ": ", f += e.dump, n += f));
  e.tag = o, e.dump = n || "{}";
}
function vt(e, r, t) {
  var i, n, o, s, a, l;
  for (n = t ? e.explicitTypes : e.implicitTypes, o = 0, s = n.length; o < s; o += 1)
    if (a = n[o], (a.instanceOf || a.predicate) && (!a.instanceOf || typeof r == "object" && r instanceof a.instanceOf) && (!a.predicate || a.predicate(r))) {
      if (t ? a.multi && a.representName ? e.tag = a.representName(r) : e.tag = a.tag : e.tag = "?", a.represent) {
        if (l = e.styleMap[a.tag] || a.defaultStyle, Ft.call(a.represent) === "[object Function]")
          i = a.represent(r, l);
        else if (Pt.call(a.represent, l))
          i = a.represent[l](r, l);
        else
          throw new T("!<" + a.tag + '> tag resolver accepts not "' + l + '" style');
        e.dump = i;
      }
      return !0;
    }
  return !1;
}
function H(e, r, t, i, n, o, s) {
  e.tag = null, e.dump = t, vt(e, t, !1) || vt(e, t, !0);
  var a = Ft.call(e.dump), l = i, u;
  i && (i = e.flowLevel < 0 || e.flowLevel > r);
  var d = a === "[object Object]" || a === "[object Array]", p, f;
  if (d && (p = e.duplicates.indexOf(t), f = p !== -1), (e.tag !== null && e.tag !== "?" || f || e.indent !== 2 && r > 0) && (n = !1), f && e.usedDuplicates[p])
    e.dump = "*ref_" + p;
  else {
    if (d && f && !e.usedDuplicates[p] && (e.usedDuplicates[p] = !0), a === "[object Object]")
      i && Object.keys(e.dump).length !== 0 ? (Bn(e, r, e.dump, n), f && (e.dump = "&ref_" + p + e.dump)) : (Dn(e, r, e.dump), f && (e.dump = "&ref_" + p + " " + e.dump));
    else if (a === "[object Array]")
      i && e.dump.length !== 0 ? (e.noArrayIndent && !s && r > 0 ? bt(e, r - 1, e.dump, n) : bt(e, r, e.dump, n), f && (e.dump = "&ref_" + p + e.dump)) : (Un(e, r, e.dump), f && (e.dump = "&ref_" + p + " " + e.dump));
    else if (a === "[object String]")
      e.tag !== "?" && Fn(e, e.dump, r, o, l);
    else {
      if (a === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new T("unacceptable kind of an object to dump " + a);
    }
    e.tag !== null && e.tag !== "?" && (u = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? u = "!" + u : u.slice(0, 18) === "tag:yaml.org,2002:" ? u = "!!" + u.slice(18) : u = "!<" + u + ">", e.dump = u + " " + e.dump);
  }
  return !0;
}
function Hn(e, r) {
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
function Vn(e, r) {
  r = r || {};
  var t = new On(r);
  t.noRefs || Hn(e, t);
  var i = e;
  return t.replacer && (i = t.replacer.call({ "": i }, "", i)), H(t, 0, i, !0, !0) ? t.dump + `
` : "";
}
var jn = Vn, $n = {
  dump: jn
}, Yt = an.load, zn = $n.dump;
const Te = {
  BACKEND: "https://url.v1.mk",
  LOCK_BACKEND: !1,
  REMOTE_CONFIG: "",
  CHUNK_COUNT: "20",
  SHORT_SERVER: "https://short.looby.us.kg"
};
function Yn(e, r = 10) {
  const t = [];
  let i = [];
  return e.forEach((n, o) => {
    i.push(n), (o + 1) % r === 0 && (t.push(i.join("|")), i = []);
  }), i.length > 0 && t.push(i.join("|")), t;
}
const Re = {
  /** 默认不启用重试 */
  retries: 0,
  /** 默认重试间隔（毫秒） */
  retryDelay: 1e3,
  /** 默认需要重试的状态码 */
  retryOnStatusCodes: [500, 502, 503, 504]
};
async function et(e, r = Re) {
  const {
    retries: t = Re.retries,
    retryDelay: i = Re.retryDelay,
    retryOnStatusCodes: n = Re.retryOnStatusCodes,
    onError: o,
    ...s
  } = r;
  let a = 0;
  const l = async () => {
    a++;
    try {
      let u, d;
      e instanceof Request ? (d = e.url, u = new Request(e, s)) : (d = e.toString(), u = new Request(d, s));
      const p = await fetch(u), f = {
        status: p.status,
        statusText: p.statusText,
        headers: Object.fromEntries(p.headers.entries()),
        data: p,
        config: { url: d, ...s },
        ok: p.ok
      };
      if (n.includes(f.status) && a <= t) {
        if (o) {
          const h = o(new Error(`请求失败，状态码 ${f.status}`), a);
          h instanceof Promise && await h;
        }
        return await new Promise((h) => setTimeout(h, i)), l();
      }
      return f;
    } catch (u) {
      if (o) {
        const d = o(u, a);
        d instanceof Promise && await d;
      }
      if (a <= t)
        return await new Promise((d) => setTimeout(d, i)), l();
      throw u;
    }
  };
  return l();
}
function Ke(e) {
  if (!e) return e;
  const r = atob(e), t = new Uint8Array(r.length);
  for (let i = 0; i < r.length; i++)
    t[i] = r.charCodeAt(i);
  return new TextDecoder().decode(t);
}
function xt(e) {
  if (!e) return e;
  const r = new TextEncoder().encode(e.trim());
  let t = "";
  for (let i = 0; i < r.length; i += 1)
    t += String.fromCharCode(r[i]);
  return btoa(t);
}
class Wn {
  constructor(r = []) {
    A(this, "existVps", []);
    A(this, "existVpsMap", /* @__PURE__ */ new Map());
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
    return r.startsWith("vless://") ? new Kt(r) : r.startsWith("vmess://") ? new Jt(r) : r.startsWith("trojan://") ? new Gt(r) : r.startsWith("ss://") ? new qt(r) : r.startsWith("hysteria2://") || r.startsWith("hysteria://") || r.startsWith("hy2://") ? new Wt(r) : null;
  }
}
class qn extends Wn {
  constructor(r = []) {
    super(r);
  }
}
var Ce, ye, _e, Ue;
class Oe {
  constructor() {
    x(this, Ce, ["localhost", "127.0.0.1", "abc.cba.com"]);
    x(this, ye, ["AES_256_GCM", "CHACHA20_POLY1305", "AES_128_GCM", "CHACHA20_IETF"]);
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
    return c(this, Ce)[Math.floor(Math.random() * c(this, Ce).length)];
  }
  /**
   * @description 获取随机端口
   * @returns {string} port
   */
  getPort() {
    return Math.floor(Math.random() * (c(this, Ue) - c(this, _e) + 1) + c(this, _e)).toString();
  }
  /**
   * @description 获取随机 SS协议的加密类型
   */
  getEncrtptionProtocol() {
    return c(this, ye)[Math.floor(Math.random() * c(this, ye).length)];
  }
}
Ce = new WeakMap(), ye = new WeakMap(), _e = new WeakMap(), Ue = new WeakMap();
var q, G;
const N = class N {
  /**
   * @description 获取备注
   * @param {string} name
   * @returns {[string, string]} [origin, confuse]
   */
  static getPs(r) {
    const t = r.split(c(N, q));
    return [t[0], t[1]];
  }
  /**
   * @description 设置备注
   * @param {string} name 原始备注
   * @param {string} ps 混淆备注
   * @returns {string} origin^LINK_TO^confuse
   */
  static setPs(r, t) {
    return [r, t].join(c(N, q));
  }
  /**
   * @description 获取前缀（带缓存）
   * @param {string} name
   * @returns {string|null} prefix
   */
  static getPrefix(r) {
    if (!(r != null && r.includes(c(N, q)))) return null;
    if (c(N, G).has(r))
      return c(N, G).get(r);
    const [t] = N.getPs(r);
    if (t) {
      const i = t.trim();
      return c(N, G).set(r, i), i;
    }
    return null;
  }
  static isConfigType(r) {
    return r.includes(c(this, q));
  }
  // 清除缓存
  static clearCache() {
    c(this, G).clear();
  }
};
q = new WeakMap(), G = new WeakMap(), x(N, q, "^LINK_TO^"), x(N, G, /* @__PURE__ */ new Map());
let L = N;
var K, Se, V, I, J, ue;
class Wt extends Oe {
  constructor(t) {
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
    x(this, ue, "");
    g(this, ue, crypto.randomUUID()), this.setOriginConfig(t), this.setConfuseConfig(t);
  }
  /**
   * @description 设置原始配置
   * @param {string} v
   */
  setOriginConfig(t) {
    g(this, K, t), g(this, V, new URL(t)), g(this, J, c(this, V).hash ?? "");
  }
  /**
   * @description 更新原始配置
   * @param {string} ps
   */
  updateOriginConfig(t) {
    c(this, V).hash = t, g(this, J, t), g(this, K, c(this, V).href), this.setConfuseConfig(c(this, K));
  }
  /**
   * @description 设置混淆配置
   * @param {string} v
   */
  setConfuseConfig(t) {
    g(this, I, new URL(t)), c(this, I).username = this.getUsername(), c(this, I).host = this.getHost(), c(this, I).hostname = this.getHostName(), c(this, I).port = this.getPort(), c(this, I).hash = L.setPs(c(this, J), c(this, ue)), g(this, Se, c(this, I).href);
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
    return c(this, J);
  }
  /**
   * @description 原始链接
   * @example 'trojan://...'
   */
  get originLink() {
    return c(this, K);
  }
  /**
   * @description 原始配置
   */
  get originConfig() {
    return c(this, V);
  }
  /**
   * @description 混淆备注
   * @example 'confusePs'
   */
  get confusePs() {
    return encodeURIComponent(c(this, ue));
  }
  /**
   * @description 混淆链接
   * @example 'trojan://...'
   */
  get confuseLink() {
    return c(this, Se);
  }
  /**
   * @description 混淆配置
   */
  get confuseConfig() {
    return c(this, I);
  }
}
K = new WeakMap(), Se = new WeakMap(), V = new WeakMap(), I = new WeakMap(), J = new WeakMap(), ue = new WeakMap();
var Q, Ae, j, F, X, ce;
class qt extends Oe {
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
    x(this, ce, "");
    g(this, ce, crypto.randomUUID()), this.setOriginConfig(t), this.setConfuseConfig(t);
  }
  /**
   * @description 设置原始配置
   * @param {string} v
   */
  setOriginConfig(t) {
    g(this, Q, t), g(this, j, new URL(t)), g(this, X, c(this, j).hash ?? "");
  }
  /**
   * @description 更新原始配置
   * @param {string} ps
   */
  updateOriginConfig(t) {
    c(this, j).hash = t, g(this, X, t), g(this, Q, c(this, j).href), this.setConfuseConfig(c(this, Q));
  }
  /**
   * @description 设置混淆配置
   * @param {string} v
   */
  setConfuseConfig(t) {
    g(this, F, new URL(t)), c(this, F).username = this.getUsername(), c(this, F).host = this.getHost(), c(this, F).hostname = this.getHostName(), c(this, F).port = this.getPort(), c(this, F).hash = L.setPs(c(this, X), c(this, ce)), g(this, Ae, c(this, F).href);
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
    return c(this, X);
  }
  /**
   * @description 原始链接
   * @example 'ss://...'
   */
  get originLink() {
    return c(this, Q);
  }
  /**
   * @description 原始配置
   */
  get originConfig() {
    return c(this, j);
  }
  /**
   * @description 混淆备注
   * @example 'confusePs'
   */
  get confusePs() {
    return c(this, ce);
  }
  /**
   * @description 混淆链接
   * @example 'ss://...'
   */
  get confuseLink() {
    return c(this, Ae);
  }
  /**
   * @description 混淆配置
   */
  get confuseConfig() {
    return c(this, F);
  }
}
Q = new WeakMap(), Ae = new WeakMap(), j = new WeakMap(), F = new WeakMap(), X = new WeakMap(), ce = new WeakMap();
var Z, Ee, $, P, ee, pe;
class Gt extends Oe {
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
    g(this, Z, t), g(this, $, new URL(t)), g(this, ee, c(this, $).hash ?? "");
  }
  /**
   * @description 更新原始配置
   * @param {string} ps
   */
  updateOriginConfig(t) {
    c(this, $).hash = t, g(this, ee, t), g(this, Z, c(this, $).href), this.setConfuseConfig(c(this, Z));
  }
  /**
   * @description 设置混淆配置
   * @param {string} v
   */
  setConfuseConfig(t) {
    g(this, P, new URL(t)), c(this, P).username = this.getUsername(), c(this, P).host = this.getHost(), c(this, P).hostname = this.getHostName(), c(this, P).port = this.getPort(), c(this, P).hash = L.setPs(c(this, ee), c(this, pe)), g(this, Ee, c(this, P).href);
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
    return c(this, ee);
  }
  /**
   * @description 原始链接
   * @example 'trojan://...'
   */
  get originLink() {
    return c(this, Z);
  }
  /**
   * @description 原始配置
   */
  get originConfig() {
    return c(this, $);
  }
  /**
   * @description 混淆备注
   * @example 'confusePs'
   */
  get confusePs() {
    return encodeURIComponent(c(this, pe));
  }
  /**
   * @description 混淆链接
   * @example 'trojan://...'
   */
  get confuseLink() {
    return c(this, Ee);
  }
  /**
   * @description 混淆配置
   */
  get confuseConfig() {
    return c(this, P);
  }
}
Z = new WeakMap(), Ee = new WeakMap(), $ = new WeakMap(), P = new WeakMap(), ee = new WeakMap(), pe = new WeakMap();
var te, ke, z, M, re, de;
class Kt extends Oe {
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
    g(this, te, t), g(this, z, new URL(t)), g(this, re, c(this, z).hash ?? "");
  }
  /**
   * @description 更新原始配置
   * @param {string} ps
   */
  updateOriginConfig(t) {
    c(this, z).hash = t, g(this, re, t), g(this, te, c(this, z).href), this.setConfuseConfig(c(this, te));
  }
  /**
   * @description 设置混淆配置
   * @param {string} v
   */
  setConfuseConfig(t) {
    g(this, M, new URL(t)), c(this, M).username = this.getUsername(), c(this, M).host = this.getHost(), c(this, M).hostname = this.getHostName(), c(this, M).port = this.getPort(), c(this, M).hash = L.setPs(c(this, re), c(this, de)), g(this, ke, c(this, M).href);
  }
  restoreClash(t, i) {
    var n;
    return t.name = i, t.server = this.originConfig.hostname ?? "", t.port = Number(((n = this.originConfig) == null ? void 0 : n.port) ?? 0), t.uuid = this.originConfig.username ?? "", t;
  }
  restoreSingbox(t, i) {
    var n;
    return t.tag = i, t.server = this.originConfig.hostname ?? "", t.server_port = Number(this.originConfig.port ?? 0), t.uuid = this.originConfig.username ?? "", (n = t.tls) != null && n.server_name && (t.tls.server_name = this.originConfig.hostname ?? ""), t;
  }
  /**
   * @description 原始备注
   * @example '#originPs'
   */
  get originPs() {
    return c(this, re);
  }
  /**
   * @description 原始链接
   * @example 'vless://...'
   */
  get originLink() {
    return c(this, te);
  }
  /**
   * @description 原始配置
   */
  get originConfig() {
    return c(this, z);
  }
  /**
   * @description 混淆备注
   * @example 'confusePs'
   */
  get confusePs() {
    return c(this, de);
  }
  /**
   * @description 混淆链接
   * @example 'vless://...'
   */
  get confuseLink() {
    return c(this, ke);
  }
  /**
   * @description 混淆配置
   */
  get confuseConfig() {
    return c(this, M);
  }
}
te = new WeakMap(), ke = new WeakMap(), z = new WeakMap(), M = new WeakMap(), re = new WeakMap(), de = new WeakMap();
var he, Le, B, U, ie, fe, De, Qt;
class Jt extends Oe {
  constructor(t) {
    super();
    x(this, De);
    /** * @description 原始链接 */
    x(this, he, "");
    /** * @description 混淆链接 */
    x(this, Le, "");
    /** * @description vps原始配置 */
    x(this, B, {});
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
    g(this, he, t), g(this, B, JSON.parse(Ke(n))), g(this, ie, c(this, B).ps ?? "");
  }
  /**
   * @description 更新原始配置
   * @param {string} ps
   */
  updateOriginConfig(t) {
    c(this, B).ps = t, g(this, ie, t), g(this, he, `vmess://${xt(JSON.stringify(c(this, B)))}`), this.setConfuseConfig();
  }
  /**
   * @description 设置混淆配置
   */
  setConfuseConfig() {
    g(this, U, structuredClone(c(this, B))), c(this, U).add = this.getHostName(), c(this, U).port = this.getPort(), c(this, U).id = this.getPassword(), c(this, U).ps = L.setPs(c(this, ie), c(this, fe)), g(this, Le, `vmess://${xt(JSON.stringify(c(this, U)))}`);
  }
  restoreClash(t, i) {
    var n, o;
    return rt(this, De, Qt).call(this, t), t.name = i, t.server = this.originConfig.add ?? "", t.port = Number(((n = this.originConfig) == null ? void 0 : n.port) ?? 0), t.uuid = ((o = this.originConfig) == null ? void 0 : o.id) ?? "", t;
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
    return c(this, ie);
  }
  /**
   * @description 原始链接
   * @example 'vmess://...'
   */
  get originLink() {
    return c(this, he);
  }
  /**
   * @description 原始配置
   */
  get originConfig() {
    return c(this, B);
  }
  /**
   * @description 混淆备注
   * @example 'confusePs'
   */
  get confusePs() {
    return c(this, fe);
  }
  /**
   * @description 混淆链接
   * @example 'vmess://...'
   */
  get confuseLink() {
    return c(this, Le);
  }
  /**
   * @description 混淆配置
   */
  get confuseConfig() {
    return c(this, U);
  }
}
he = new WeakMap(), Le = new WeakMap(), B = new WeakMap(), U = new WeakMap(), ie = new WeakMap(), fe = new WeakMap(), De = new WeakSet(), Qt = function(t) {
  t.network === "ws" && (t["ws-opts"] = {
    ...t["ws-opts"],
    path: this.originConfig.path,
    headers: {
      ...t["ws-opts"].headers,
      Host: this.originConfig.host
    }
  });
};
class Gn extends qn {
  constructor(t, i = []) {
    super(i);
    A(this, "urlSet", /* @__PURE__ */ new Set());
    A(this, "vpsStore", /* @__PURE__ */ new Map());
    A(this, "originUrls", /* @__PURE__ */ new Set());
    A(this, "vps", []);
    this.vps = t;
  }
  async parse(t = this.vps) {
    for await (const i of t) {
      const n = this.updateVpsPs(i);
      if (n) {
        let o = null;
        n.startsWith("vless://") ? o = new Kt(n) : n.startsWith("vmess://") ? o = new Jt(n) : n.startsWith("trojan://") ? o = new Gt(n) : n.startsWith("ss://") ? o = new qt(n) : this.isHysteria2(n) && (o = new Wt(n)), o && this.setStore(n, o);
      }
      if (i.startsWith("https://") || i.startsWith("http://")) {
        const o = await et(i, { retries: 3 }).then((a) => a.data.text());
        if (this.getSubType(o) === "base64") {
          this.updateExist(Array.from(this.originUrls));
          const a = Ke(o);
          await this.parse(a.split(`
`).filter(Boolean));
        }
      }
    }
  }
  setStore(t, i) {
    this.urlSet.add(i.confuseLink), this.originUrls.add(t), this.vpsStore.set(i.confusePs, i);
  }
  getSubType(t) {
    try {
      return Ke(t), "base64";
    } catch {
      try {
        return Yt(t), "yaml";
      } catch {
        try {
          return JSON.parse(t), "json";
        } catch {
          return "unknown";
        }
      }
    }
  }
  isHysteria2(t) {
    return t.startsWith("hysteria2://") || t.startsWith("hysteria://") || t.startsWith("hy2://");
  }
  get urls() {
    return Array.from(this.urlSet);
  }
  get vpsMap() {
    return this.vpsStore;
  }
}
let Kn = class {
  async getConfig(r) {
    try {
      const t = await Promise.all(r.map((i) => et(i, { retries: 3 }).then((n) => n.data.text())));
      return this.setClashConfig(t);
    } catch (t) {
      throw new Error(t.message || t);
    }
  }
  setClashConfig(r) {
    const t = r.map((i) => Yt(i));
    return this.mergeClashConfig(t);
  }
  /**
   * @description 合并配置
   * @param {ClashType[]} configs
   * @returns {ClashType} mergedConfig
   */
  mergeClashConfig(r = []) {
    var u, d, p, f;
    if (!r.length)
      return {};
    const t = structuredClone(r[0]);
    if (r.length === 1)
      return t;
    const i = {
      ...t,
      proxies: t.proxies || [],
      "proxy-groups": t["proxy-groups"] || []
    }, n = r.reduce((h, b) => {
      var v;
      return h + (((v = b.proxies) == null ? void 0 : v.length) || 0);
    }, 0), o = new Int32Array(n), s = new Set((u = t.proxies) == null ? void 0 : u.map((h) => h.name));
    let a = ((d = t.proxies) == null ? void 0 : d.length) || 0;
    const l = new Map(i["proxy-groups"].map((h) => [h.name, h]));
    for (let h = 1; h < r.length; h++) {
      const b = r[h];
      if ((p = b.proxies) != null && p.length)
        for (const v of b.proxies)
          s.has(v.name) || (i.proxies[a] = v, o[a] = a, s.add(v.name), a++);
      if ((f = b["proxy-groups"]) != null && f.length)
        for (const v of b["proxy-groups"]) {
          const C = l.get(v.name);
          if (C) {
            const O = new Set(C.proxies);
            for (const w of v.proxies || [])
              O.add(w);
            C.proxies = Array.from(O), Object.assign(C, {
              ...v,
              proxies: C.proxies
            });
          } else
            i["proxy-groups"].push(v), l.set(v.name, v);
        }
    }
    return i.proxies = i.proxies.filter((h, b) => o[b] !== -1), i;
  }
}, Jn = class {
  async getConfig(r) {
    try {
      const t = await Promise.all(
        r.map((i) => et(i, { retries: 3 }).then((n) => n.data.json()))
      );
      return this.mergeConfig(t);
    } catch (t) {
      throw new Error(t.message || t);
    }
  }
  mergeConfig(r) {
    var s, a;
    if (r.length === 0)
      return {};
    const t = structuredClone(r[0]), i = [], n = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
    for (const l of r)
      if ((s = l.outbounds) != null && s.length) {
        for (const u of l.outbounds)
          if (u.outbounds) {
            const d = `${u.type}:${u.tag}`;
            if (!o.has(d)) {
              const p = new Set(u.outbounds.filter((f) => !L.isConfigType(f)));
              o.set(d, {
                base: u,
                baseOutbounds: p,
                linkOutbounds: /* @__PURE__ */ new Set()
              });
            }
            u.outbounds.forEach((p) => {
              var f;
              L.isConfigType(p) && ((f = o.get(d)) == null || f.linkOutbounds.add(p));
            });
          }
      }
    for (const l of r)
      if ((a = l.outbounds) != null && a.length) {
        for (const u of l.outbounds)
          if (!u.outbounds)
            if (L.isConfigType(u.tag))
              i.push(u);
            else {
              const d = `${u.type}:${u.tag}`;
              n.has(d) || (n.add(d), i.push(u));
            }
      }
    for (const [l, u] of o) {
      const d = { ...u.base }, p = /* @__PURE__ */ new Set([...u.baseOutbounds, ...u.linkOutbounds]);
      d.outbounds = Array.from(p), i.push(d);
    }
    return t.outbounds = i, t;
  }
};
class Qn {
  constructor(r) {
    A(this, "urls", []);
    A(this, "chunkCount", Number(Te.CHUNK_COUNT));
    A(this, "backend", Te.BACKEND);
    A(this, "parser", null);
    A(this, "clashClient", new Kn());
    A(this, "singboxClient", new Jn());
    this.chunkCount = Number(r.CHUNK_COUNT ?? Te.CHUNK_COUNT), this.backend = r.BACKEND ?? Te.BACKEND, this.parser = null;
  }
  async setSubUrls(r) {
    const { searchParams: t } = new URL(r.url), n = t.get("url").split(/\||\n/).filter(Boolean);
    this.parser = new Gn(n), await this.parser.parse(n);
    const o = Yn(Array.from(this.parser.urls), Number(this.chunkCount));
    this.urls = o.map((s) => {
      const a = new URL(`${this.backend}/sub`), { searchParams: l } = new URL(r.url);
      return l.set("url", s), a.search = l.toString(), a.toString();
    });
  }
  async getClashConfig() {
    return await this.clashClient.getConfig(this.urls);
  }
  async getSingboxConfig() {
    return await this.singboxClient.getConfig(this.urls);
  }
  get vpsStore() {
    var r;
    return (r = this.parser) == null ? void 0 : r.vpsMap;
  }
}
class Xn {
  constructor(r) {
    A(this, "confuseConfig");
    this.confuseConfig = r;
  }
  getOriginConfig(r) {
    try {
      return this.confuseConfig.proxies = this.restoreProxies(this.confuseConfig.proxies, r), this.confuseConfig["proxy-groups"] = this.confuseConfig["proxy-groups"].map((t) => (t.proxies && (t.proxies = this.updateProxiesGroups(t.proxies)), t)), this.confuseConfig;
    } catch (t) {
      throw new Error(`Get origin config failed: ${t.message || t}, function trace: ${t.stack}`);
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
class Zn {
  constructor(r) {
    A(this, "confuseConfig");
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
class eo {
  constructor(r) {
    this.confuse = r, this.confuse = r;
  }
  async getClashConfig() {
    const r = await this.confuse.getClashConfig();
    return new Xn(r).getOriginConfig(this.confuse.vpsStore);
  }
  async getSingboxConfig() {
    const r = await this.confuse.getSingboxConfig();
    return new Zn(r).getOriginConfig(this.confuse.vpsStore);
  }
}
class to {
  constructor(r) {
    this.db = r;
  }
  async toSub(r, t, i) {
    try {
      const n = new Qn(t);
      await n.setSubUrls(r);
      const o = new eo(n);
      if (["clash", "clashr"].includes(i)) {
        const s = await o.getClashConfig();
        return new Response(zn(s, { indent: 2, lineWidth: 200 }), {
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
      return y.error("Unsupported client type, support list: clash, clashr");
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
const wt = new tr(), oo = {
  async fetch(e, r) {
    try {
      if (e.method === "OPTIONS")
        return y.cors(new Response(null, { status: 200 }));
      const t = new to(r.DB), i = new er(t);
      wt.get("/", (o) => xr(o, r)).get("/favicon.ico", () => new Response(null, { status: 200 })).get("/sub", (o) => i.toSub(o, r)).post("/api/add", (o) => i.add(o)).delete("/api/delete", (o) => i.delete(o)).get("/api/queryByCode", (o) => i.queryByCode(o)).get("/api/queryList", (o) => i.queryList(o)).get("/:code", (o) => i.redirect(o));
      const n = await wt.handle(e, r);
      return y.cors(n);
    } catch (t) {
      return y.error(t.message || t);
    }
  }
};
export {
  oo as default
};
