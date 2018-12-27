class Properties {

    static elementID = "properties";
    static element;
    static lastObject;
    
    static ShowData(obj:any):void {
        Properties.lastObject = obj;

        if (obj.constructor.name == "Edge") {
            Properties.EdgeData(obj);
            return;
        }

        Properties.ClearData();
        let header = document.createElement("h2");
        header.innerHTML = obj.constructor.name + " properties:";
        Properties.element.appendChild(header);

        for (let propertyName in obj) {
            if (obj[propertyName].constructor.name == "Vertex") {
                Properties.VertexEditor(propertyName, obj[propertyName]);
                Properties.element.appendChild(document.createElement("p"));
            } else {
                console.log("No handler for property type: "+ obj[propertyName].constructor.name+" with name "+propertyName);
            }
        }
    }
    
    static Refresh() {
        Properties.ShowData(Properties.lastObject);
    }

    static EdgeData(edge:Edge) {
        Properties.lastObject = edge;
        Properties.ClearData();

        let header = document.createElement("h2");
        header.innerHTML = "Edge properties:";
        Properties.element.appendChild(header);

        Properties.VertexData("Start", edge.start);
        Properties.NewLine();
        Properties.VertexData("End", edge.end);
        Properties.NewLine();
        Properties.NewLine();
        Properties.EdgeModifiers(edge.modifiers);
    }

    static EdgeModifiers(modifiers:Array<EdgeModifier>):void {
        if (modifiers.length == 0) return;

        Properties.element.insertAdjacentHTML += "Modifiers: <p>";

        for (let i = 0; i < modifiers.length; i++) {
            let m = modifiers[i];

            Properties.Label(m.name);
            if (m.editorElement) {
                Properties.element.appendChild(m.editorElement());
            }
            Properties.Button("Remove", function() {
                modifiers.splice(modifiers.indexOf(m), 1);
                Properties.Refresh();
                dirty = true;
            });
            Properties.NewLine();
            Properties.NewLine();
        }
    }

    static Label(text:string):void {
        let elem = document.createElement("span");
        elem.innerHTML = text;
        Properties.element.appendChild(elem);
    }

    static Button(name:string, onClick:Function):void {
        let button = document.createElement("input");
        button.type = "button";
        button.value = name;
        button.onclick = function() {
            onClick();
        };
        Properties.element.appendChild(button);
    }

    static NewLine():void {
        Properties.element.appendChild(document.createElement("br"));
    }

    static VertexData(name:string, v:Vertex):void {
        Properties.Label(name + " ( "+v.x+", "+v.y+" )");
    }

    static VertexEditor(name:string, v:Vertex):void {
        Properties.Label(name);
        Properties.element.appendChild(
            Properties.NumberField(v, "x")
        );
        Properties.element.appendChild(
            Properties.NumberField(v, "y")
        );
    }

    static NumberField(obj:Object, prop:string):HTMLElement {
        let span = document.createElement("span");
        span.innerHTML = prop;
        let elem = document.createElement("input");
        elem.type = "number";
        elem.value = obj[prop];
        elem.style.width = "20%";
        elem.onchange = function () {
            obj[prop] = elem.value;
            dirty = true;
        };
        span.appendChild(elem);
        return span;
    }

    static ClearData():void {
        if (Properties.element == null) {
            Properties.element = document.getElementById(Properties.elementID);
        }

        while (Properties.element.hasChildNodes()) {
            Properties.element.removeChild(Properties.element.lastChild);
        }
        Properties.element.innerHTML = "";
    }

}