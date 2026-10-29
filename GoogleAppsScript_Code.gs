const KEY = 'GRAFIK_DATA_V1';

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'get';
  if (action !== 'get') return json({ok:false,error:'Unknown action'});
  const raw = PropertiesService.getScriptProperties().getProperty(KEY) || '{}';
  let data = {};
  try { data = JSON.parse(raw); } catch (_) {}
  return json({ok:true,data:data});
}

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (body.action !== 'set' || !body.data || typeof body.data !== 'object') {
      return json({ok:false,error:'Invalid payload'});
    }
    PropertiesService.getScriptProperties().setProperty(KEY, JSON.stringify(body.data));
    return json({ok:true});
  } catch (err) {
    return json({ok:false,error:String(err)});
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}