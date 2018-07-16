function updateClubList() {
/*
会員情報変更届フォームの部活リストを更新するスクリプト
*/
    
    // readConfig 関数を呼び出して、設定シート上にある値を読み込む。返り値は連想配列。
    var configHash = readConfig();
    // 連想配列からキー値を用いて値を読み込む
    var listSheetName = configHash["リスト"];
    var mailToGroup = configHash["グループ送信先"];
    var replyToAddress = configHash["返信先"];
    var formURL = configHash["変更届フォームURL"];
    var formID = configHash["フォームID"]
    
    //入力されたクラブリストを取得
    var clubSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(listSheetName);
    var lastRow = clubSheet.getLastRow();
    var updatedClubs = clubSheet.getSheetValues(2, 1, lastRow, 1);

    //Formの情報を取得
    var form = FormApp.openById(formID);
    var listItem = form.getItems(FormApp.ItemType.LIST);
    
    for(var i = 0; i < listItem.length; i++){
        var listTitle = listItem[i].getTitle();
        if(listTitle.indexOf("所属クラブ") >= 0){
            Logger.log(listItem[i].getTitle());
            var clubsChoice =[];
            var clubList = listItem[i].asListItem();
            for(var j = 0; j < updatedClubs.length; j++){
                if(updatedClubs[j][0] !== ""){
                    clubsChoice.push(clubList.createChoice(updatedClubs[j][0]));
                }                
            }
            clubList.setChoices(clubsChoice);
            /*
            var choices = clubList.getChoices();
            for(var j = 0; j < choices.length; j++){
                //Logger.log(choices[j].getValue());
                clubs.push(choices[j].getValue());
            }
            */
            //Logger.log(choices);
        }
    }

    //これより部活リストが更新されたことを伝えるメールを送信
    var body = "会員情報変更届けフォームの所属クラブリストが更新されました。\r\n" + formURL + " にアクセスしてリストが問題なく更新されているか確認をして下さい。\r\n\r\n"
    body = body + "現在の所属クラブリストは以下の通りです。\r\n\r\n"

    for(var i = 0; i < updatedClubs.length; i++){
        if(updatedClubs[i][0] !== 0){
            body = body + updatedClubs[i][0] + "\r\n"
        }
    }

    MailApp.sendEmail({      
        to: mailToGroup,
        subject: "会員情報変更届けフォームの所属クラブリストが更新されました。",
        body: body,
        replyTo: replyToAddress,
    });

    /*var clubSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(listSheetName);
    var row = 2;
    for(var k = 0; k < clubs.length; k++){
        clubSheet.getRange(row, 1).setValue(clubs[k]);
        row++;
    }
    */
        
}

function getCurrentClubList(){
/*
会員情報変更届フォームの現在の部活リストを取得するスクリプト
*/
    
    // readConfig 関数を呼び出して、設定シート上にある値を読み込む。返り値は連想配列。
    var configHash = readConfig();
    // 連想配列からキー値を用いて値を読み込む
    var listSheetName = configHash["リスト"];
    var mailToGroup = configHash["グループ送信先"];
    var replyToAddress = configHash["返信先"];
    var formURL = configHash["変更届フォームURL"];
    var formID = configHash["フォームID"]
    
    //入力されたクラブリストを取得
    var clubSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(listSheetName);
    var lastRow = clubSheet.getLastRow();
    var updatedClubs = clubSheet.getSheetValues(2, 1, lastRow, 1);

    //Formの情報を取得
    var form = FormApp.openById(formID);
    var listItem = form.getItems(FormApp.ItemType.LIST);
    
    for(var i = 0; i < listItem.length; i++){
        var listTitle = listItem[i].getTitle();
        if(listTitle.indexOf("所属クラブ1") >= 0){
            Logger.log(listItem[i].getTitle());
            var clubList = listItem[i].asListItem();

            var choices = clubList.getChoices();
            var clubs = [];
            for(var j = 0; j < choices.length; j++){
                //Logger.log(choices[j].getValue());
                clubs.push(choices[j].getValue());
            }
        }
    }
    
    var clubSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(listSheetName);
    var row = 2;
    for(var k = 0; k < clubs.length; k++){
        clubSheet.getRange(row, 1).setValue(clubs[k]);
        row++;
    }

}

function onOpen(){
 
    //メニュー配列
    var myMenu=[
      {name: "所属クラブリスト更新", functionName: "updateClubList"}
    ];
   
    SpreadsheetApp.getActiveSpreadsheet().addMenu("スクリプト実行",myMenu); //メニューを追加
   
}
