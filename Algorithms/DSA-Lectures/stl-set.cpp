#include<iostream>
#include<set>
#include<unordered_set>
using namespace std;

int main()
{
    set<int> st;
    //unordered_set<int> st;
    st.insert(40);
    st.insert(20);
    st.insert(30);
    st.insert(10);

    set<int>::iterator it=st.begin();
    while(it!=st.end()){
        cout<<*it<<" ";
        it++;
    }cout<<endl;

    if(st.empty()){
        cout<<"Empty";
    }else cout<<"NOT Empty"<<endl;
    //st.size()
    //st.clear()

    if(st.find(10)!=st.end()){
        cout<<"Found";
    }else cout<<"NOT Found"<<endl;

    if(st.count(25)==1){
        cout<<"Found";
    }else cout<<"NOT Found";
}