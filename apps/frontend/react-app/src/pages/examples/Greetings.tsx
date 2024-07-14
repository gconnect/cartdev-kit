import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useEthersSigner } from '../../utils/useEtherSigner';
import { errorAlert, successAlert } from '../../utils/customAlert';
import {
  Table,
  Thead,
  Tbody, Tr,
  Th,
  Td,
  TableCaption,
  TableContainer
} from '@chakra-ui/react';
import { addInput, inspectCall } from '../../cartesi/Portals';
import { useRollups } from '../../cartesi/hooks/useRollups';
import { DAPP_ADDRESS, INSPECT_BASE_URL } from '../../utils/constants';

export default function Greetings() {
  const [loading, setLoading] = useState(false);
  const [listMessages, setMessageList] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState('');
  const [isEdit, setEdit] = useState(false);
  const [id, setId] = useState(0);

  const { address } = useAccount();
  const rollups  = useRollups(DAPP_ADDRESS)
  const signer = useEthersSigner();

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value);

  const sendGreeting = async () => {
    const payload = {
      "method": "create_greeting",
      "args": {
        "message": message,
      }
    }
    try {
      if (!message) return errorAlert("Field required");
      if (!address) return errorAlert("Ensure your wallet is connected");
      setLoading(true);
      const res: any  = await addInput(rollups, JSON.stringify(payload), DAPP_ADDRESS)
      if(!res.hash) return errorAlert(res);
      setMessage("");
      setLoading(false);
      successAlert(res.hash);
      await getGreetings();
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const updateMessage = async (id: number) => {
    const payload = {
      "method": "update_greeting",
      "args": {
        "greetingId": id,
        "message": message,
      }
    }
    try {
      if (!message) return errorAlert("Field required");
      if (!address) return errorAlert("Ensure your wallet is connected");
      setLoading(true);
      const res: any =await addInput(rollups, JSON.stringify(payload), DAPP_ADDRESS)
      if(!res.hash) return errorAlert(res);
      setMessage("");
      setLoading(false);
      successAlert(res.hash);
      setEdit(false);
      await getGreetings();
    } catch (error) {
      setLoading(false);
    }
  };

  const getGreeting = useCallback(async (id: number) => {
    try {
      setFetching(true);
      await inspectCall(INSPECT_BASE_URL, "get_greeting");
      setFetching(false);
    } catch (error) {
      setFetching(false);
      console.log("error", error);
    }
  }, []);

  const getGreetings = useCallback(async () => {
    try {
      setFetching(true);
      const res = await inspectCall(INSPECT_BASE_URL, "get_greetings");
      console.log("res", res);
      setMessageList(res); // Assuming res is JSON string
      setFetching(false);
    } catch (error) {
      setFetching(false);
      console.log("error", error);
    }
  }, []);

  const deleteGreeting = useCallback(async (id: number) => {
    const payload = {
      "method": "delete_greeting",
      "args": {
        "greetingId": id,
      }
    }
    try {
      const res: any = await addInput(rollups, JSON.stringify(payload), DAPP_ADDRESS);
      if(!res.hash) return errorAlert(res);
      successAlert(res.hash)
      await getGreetings()
    } catch (error) {
      console.log("error", error);
    }
  }, [getGreetings, rollups]);

  const deleteGreetings = useCallback(async () => {
    const payload = {
      "method": "delete_greetings",
    }
    try {
      const res: any  = await addInput(rollups, JSON.stringify(payload), DAPP_ADDRESS);
      if(!res.hash) return errorAlert(res);
      successAlert(res.hash)
      await getGreetings()
    } catch (error) {
      console.log("error", error);
    }
  }, [getGreetings, rollups]);

  console.log("listMessages", listMessages);
  console.log("id", id);
  useEffect(() => {
    getGreetings();
  }, [getGreetings]);

  return (
    <div className="flex min-h-screen flex-col lg:mb-2 md:mb-8 mb-36 items-center text-black">
      <h1 className='mt-16 lg:mt-36 md:mt-24 text-xl mb-4 font-bold text-gray-400'>Welcome! Say Hello 👋</h1>
      <input className='p-4 rounded border-2 lg:w-1/3 md:w-full w-3/4' type="text" onChange={handleMessageChange} placeholder='Enter your message' value={message} required />
      <button className='bg-purple-400 p-4 mt-4 lg:w-1/3 md:w-1/2 w-3/4 rounded' onClick={async () => {
        if (!isEdit) {
          await sendGreeting();
        } else {
          await updateMessage(id);
        }
      }}>
        {loading ? "Sending message please wait... 💁‍♀️" : isEdit ? 'Update' : "Send"}
      </button>
      {fetching && (<p className='mt-4 text-gray-400'>Fetching data...</p>)}

      {(!listMessages || listMessages.length === 0) ? (<div></div>):
        (
          <div>
            <p className="my-4 font-bold text-gray-400">Output</p>
            <TableContainer className='border'>
              <Table variant='simple'>
                <TableCaption onClick={async () => {
                  deleteGreetings()
                }} textColor={"purple"} paddingBottom={"24px"} className='text-red-400'>Delete all messages</TableCaption>
                <Thead>
                  <Tr className='flex justify-between'>
                    <Th>S/N</Th>
                    <Th>Message</Th>
                    <Th>Remove</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {listMessages && listMessages.map((item: any, index: any) => (
                    <Tr key={index} className='mb-2  flex justify-between'>
                      <Td className='text-gray-400'>{item.id}</Td>
                      <Td onClick={async () => {
                        try {
                          setId(item.id);
                          setEdit(true);
                          setMessage(item.message);
                        } catch (error) {
                          errorAlert(error);
                        }
                      }} className='text-gray-400'>{item.message}</Td>
                      <Td onClick={async () => {
                        try {
                          await deleteGreeting(item.id);
                          await getGreetings();
                        } catch (error) {
                          errorAlert(error);
                        }
                      }} className='bg-red-400 rounded p-4'>🗑️</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </div>
        )}
    </div>
  );
}
