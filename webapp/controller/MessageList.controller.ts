import Controller from "sap/ui/core/mvc/Controller";
import CustomListItem from "sap/m/CustomListItem";
import Input from "sap/m/Input";
import MessageBox from "sap/m/MessageBox";
import MessageStrip from "sap/m/MessageStrip";
import List from "sap/m/List";
import HBOX from "sap/m/HBox";
import Text from "sap/m/Text";
import JSONModel from "sap/ui/model/json/JSONModel";
import Icon from "sap/ui/core/Icon";


type Query = {
 question: string,
 answer: string
}


export default class MessageList extends Controller {

    async getAnswer(question: string): Promise<string> {
     const response = await fetch(`http://127.0.0.1:8000/${question}`);
     const json = await response.json() as Query;
     (this.getView()?.getModel() as JSONModel).setData(json);
     return json.answer;
    }

    onAskQuestion(): void {
        console.log("I press..")
        const oInput = this.byId("chatInput") as Input;
        const question = oInput.getValue();
        console.log(question);
        this.getAnswer(question).then((result: string) => {
            console.log(result);
            const oList = this.byId("chatList") as List;

            const questionText = new Text({ text: question + "\n" });
            // const questionItem = new CustomListItem({
            //     content: questionText,
            // });
            // oList.addItem(questionItem);

            const questionIcon = new Icon({
                src: "sap-icon://person-placeholder",
                size: "1rem",
            });
            questionIcon.addStyleClass("iconMargin");
            const questionHBox = new HBOX({
                items: [
                    questionIcon,
                    questionText
                ],
                alignItems: "Center"
            });

            const questionItem = new CustomListItem({
                content: questionHBox
            });
            oList.addItem(questionItem);


            const answerText = new Text({ text: result + "\n" });

            const answerIcon = new Icon({
                src: "sap-icon://ai", 
                size: "1rem", 
            });
            answerIcon.addStyleClass("iconMargin");

            const answerHBox = new HBOX({
                items: [
                    answerIcon,
                    answerText
                ],
                alignItems: "Center"
            });
            answerHBox.addStyleClass("textRightAlign"); 

            const answerItem = new CustomListItem({
                content: answerHBox
            });
            oList.addItem(answerItem);





        }).catch(() => {
            MessageBox.alert(`Failure while getting answer...`, {
                actions: MessageBox.Action.CLOSE 
            });
        });;
        oInput.setValue("");
    } 
};